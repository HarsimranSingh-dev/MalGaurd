"""
MalGuard Demo Test File Generator
===================================
Creates SAFE fake files that trigger different verdicts for demo purposes.
These are NOT real malware — they are crafted byte sequences that look
suspicious to a static analyzer without being executable threats.

Run: python tests/create_demo_files.py
"""

import struct
import hashlib
import os
from pathlib import Path

OUTPUT_DIR = Path("tests/demo_files")
OUTPUT_DIR.mkdir(exist_ok=True)


def make_fake_pe_with_ransomware_imports() -> bytes:
    """
    Build a minimal syntactically valid PE file that contains
    ransomware-associated import names in its string table.
    This is NOT executable — it will crash if run.
    It's designed purely to trigger static analysis detection.
    """
    # MZ header (DOS stub)
    mz_header = b'MZ' + b'\x00' * 58 + struct.pack('<I', 0x40)  # e_lfanew = 0x40

    # PE signature + COFF header
    pe_sig = b'PE\x00\x00'
    coff = struct.pack('<HHIIIHH',
        0x8664,   # Machine: AMD64
        1,        # NumberOfSections
        0,        # TimeDateStamp
        0,        # PointerToSymbolTable
        0,        # NumberOfSymbols
        0xF0,     # SizeOfOptionalHeader
        0x0022,   # Characteristics: executable + large address aware
    )

    # Suspicious strings that mimic ransomware imports
    suspicious_strings = b'\x00'.join([
        b'CryptEncrypt',
        b'CryptGenKey',
        b'CryptImportKey',
        b'FindFirstFileW',
        b'FindNextFileW',
        b'MoveFileExW',
        b'DeleteFileW',
        b'VirtualAllocEx',
        b'WriteProcessMemory',
        b'CreateRemoteThread',
        b'RegSetValueEx',
        b'ADVAPI32.dll',
        b'KERNEL32.dll',
        b'WS2_32.dll',
        b'WSAStartup',
        b'connect',
        b'YOUR_FILES_HAVE_BEEN_ENCRYPTED',
        b'README_DECRYPT.txt',
        b'bitcoin',
        b'.locked',
        b'.encrypted',
    ]) + b'\x00' * 200

    # Pad to make a realistic file size with high-ish entropy filler
    import random
    random.seed(42)
    filler = bytes([random.randint(0, 255) for _ in range(4096)])

    return mz_header + pe_sig + coff + suspicious_strings + filler


def make_fake_trojan_pe() -> bytes:
    """Fake PE with process injection + persistence + C2 network imports."""
    mz_header = b'MZ' + b'\x00' * 58 + struct.pack('<I', 0x40)
    pe_sig = b'PE\x00\x00'
    coff = struct.pack('<HHIIIHH', 0x14c, 1, 0, 0, 0, 0xE0, 0x0102)

    trojan_strings = b'\x00'.join([
        b'VirtualAllocEx',
        b'WriteProcessMemory',
        b'CreateRemoteThread',
        b'RegSetValueEx',
        b'RegCreateKeyEx',
        b'CreateService',
        b'InternetOpenA',
        b'InternetReadFile',
        b'URLDownloadToFileA',
        b'IsDebuggerPresent',
        b'NtQueryInformationProcess',
        b'KERNEL32.dll',
        b'ADVAPI32.dll',
        b'WININET.dll',
        b'cmd.exe',
        b'/c powershell',
        b'http://malicious-c2.example.com',
    ]) + b'\x00' * 200

    import random
    random.seed(99)
    filler = bytes([random.randint(0, 255) for _ in range(2048)])

    return mz_header + pe_sig + coff + trojan_strings + filler


def make_fake_spyware_pe() -> bytes:
    """Fake PE with keylogger + credential dumping imports."""
    mz_header = b'MZ' + b'\x00' * 58 + struct.pack('<I', 0x40)
    pe_sig = b'PE\x00\x00'
    coff = struct.pack('<HHIIIHH', 0x14c, 1, 0, 0, 0, 0xE0, 0x0102)

    spyware_strings = b'\x00'.join([
        b'SetWindowsHookExA',
        b'GetKeyState',
        b'GetAsyncKeyState',
        b'LsaEnumerateLogonSessions',
        b'SamQueryInformationUser',
        b'CryptHashData',
        b'CryptDecrypt',
        b'GetClipboardData',
        b'BitBlt',
        b'CaptureScreenShot',
        b'keylog.txt',
        b'passwords.dat',
        b'ADVAPI32.dll',
        b'USER32.dll',
    ]) + b'\x00' * 200

    import random
    random.seed(77)
    filler = bytes([random.randint(50, 200) for _ in range(2048)])

    return mz_header + pe_sig + coff + spyware_strings + filler


def make_clean_pe() -> bytes:
    """Fake PE with only normal, harmless imports."""
    mz_header = b'MZ' + b'\x00' * 58 + struct.pack('<I', 0x40)
    pe_sig = b'PE\x00\x00'
    coff = struct.pack('<HHIIIHH', 0x14c, 1, 0, 0, 0, 0xE0, 0x0102)

    clean_strings = b'\x00'.join([
        b'MessageBoxA',
        b'GetSystemTime',
        b'CreateFileA',
        b'ReadFile',
        b'WriteFile',
        b'CloseHandle',
        b'GetLastError',
        b'USER32.dll',
        b'KERNEL32.dll',
        b'Hello World',
    ]) + b'\x00' * 200

    filler = b'\x00' * 1024

    return mz_header + pe_sig + coff + clean_strings + filler


def save_and_report(name: str, data: bytes, description: str):
    path = OUTPUT_DIR / name
    path.write_bytes(data)
    sha256 = hashlib.sha256(data).hexdigest()
    print(f"\n  [{description}]")
    print(f"  File    : {path}")
    print(f"  Size    : {len(data):,} bytes")
    print(f"  SHA-256 : {sha256[:32]}...")
    print(f"  --> Upload to /api/analyze to demo detection")


if __name__ == "__main__":
    print("=" * 60)
    print("MalGuard Demo File Generator")
    print("Creating SAFE test files for demonstration")
    print("=" * 60)
    print(f"\nOutput directory: {OUTPUT_DIR.resolve()}")

    save_and_report(
        "demo_ransomware_like.exe",
        make_fake_pe_with_ransomware_imports(),
        "RANSOMWARE-LIKE (contains encrypt/file APIs)"
    )

    save_and_report(
        "demo_trojan_like.exe",
        make_fake_trojan_pe(),
        "TROJAN-LIKE (contains injection/persistence/C2 APIs)"
    )

    save_and_report(
        "demo_spyware_like.exe",
        make_fake_spyware_pe(),
        "SPYWARE-LIKE (contains keylogger/credential APIs)"
    )

    save_and_report(
        "demo_clean.exe",
        make_clean_pe(),
        "CLEAN (only normal system APIs)"
    )

    print("\n" + "=" * 60)
    print("[DONE] 4 demo files created in tests/demo_files/")
    print("\nHOW TO USE FOR DEMO:")
    print("  1. Start server: uvicorn backend.main:app --reload --port 8000")
    print("  2. Open: http://localhost:8000/docs")
    print("  3. POST /api/analyze -> upload each file")
    print("  4. Show judges the different verdicts!")
    print("=" * 60)
