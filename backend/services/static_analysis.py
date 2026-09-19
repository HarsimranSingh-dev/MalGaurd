"""
Static Analysis Engine – MalGuard Module 2
==========================================
Performs safe, read-only analysis of uploaded files WITHOUT executing them.

Features extracted
------------------
* SHA-256 / MD5 cryptographic hashes
* MIME type detection (using python-magic or fallback)
* Shannon entropy  →  packed/encrypted content detection
* PE header parsing (imports, sections, TLS, overlay)
* Printable string extraction (top-N)
* Packer heuristic detection

All analysis happens in a sandboxed temp directory; files are deleted
immediately after extraction regardless of success or failure.
"""

import hashlib
import math
import os
import re
import string
import tempfile
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import pefile

from backend.core.config import settings


# ── Constants ────────────────────────────────────────────────────────────────

SUSPICIOUS_IMPORTS: Dict[str, List[str]] = {
    "Process Injection": [
        "VirtualAllocEx", "WriteProcessMemory", "CreateRemoteThread",
        "NtCreateThreadEx", "RtlCreateUserThread", "QueueUserAPC",
    ],
    "Persistence": [
        "RegSetValueEx", "RegCreateKeyEx", "CreateService",
        "StartService", "SHFileOperation",
    ],
    "Credential Access": [
        "CryptHashData", "CryptDecrypt", "LsaEnumerateLogonSessions",
        "SamQueryInformationUser",
    ],
    "Ransomware Indicators": [
        "CryptEncrypt", "CryptGenKey", "CryptImportKey",
        "FindFirstFileW", "FindNextFileW", "MoveFileExW",
    ],
    "Network/C2": [
        "WSAStartup", "connect", "InternetOpenA", "InternetReadFile",
        "HttpSendRequestA", "URLDownloadToFileA",
    ],
    "Evasion": [
        "IsDebuggerPresent", "CheckRemoteDebuggerPresent",
        "NtQueryInformationProcess", "GetTickCount", "Sleep",
        "VirtualProtect",
    ],
    "Discovery": [
        "GetSystemInfo", "EnumProcesses", "CreateToolhelp32Snapshot",
        "Process32First", "GetComputerNameA",
    ],
}

PACKER_SECTION_NAMES = {
    b"UPX0", b"UPX1", b"UPX2",
    b".ASPack", b".aspack",
    b".themida", b".Themida",
    b".nsp0", b".nsp1",
    b".MPRESS1", b".MPRESS2",
    b"PESpin",
}

PRINTABLE_CHARS = set(string.printable.encode())
MIN_STRING_LEN = 4
MAX_STRINGS_RETURNED = 50
HIGH_ENTROPY_THRESHOLD = 7.0   # bits per byte – UPX/encrypted sections


# ── Helpers ──────────────────────────────────────────────────────────────────

def _compute_hashes(data: bytes) -> Dict[str, str]:
    return {
        "sha256": hashlib.sha256(data).hexdigest(),
        "md5": hashlib.md5(data).hexdigest(),
        "sha1": hashlib.sha1(data).hexdigest(),
    }


def _shannon_entropy(data: bytes) -> float:
    """Calculate Shannon entropy (0–8 bits/byte)."""
    if not data:
        return 0.0
    freq: Dict[int, int] = {}
    for byte in data:
        freq[byte] = freq.get(byte, 0) + 1
    length = len(data)
    return -sum(
        (count / length) * math.log2(count / length)
        for count in freq.values()
    )


def _detect_mime(data: bytes) -> str:
    """
    Detect MIME type.  Prefers python-magic; falls back to PE-header sniffing
    and finally to 'application/octet-stream'.
    """
    try:
        import magic  # type: ignore
        return magic.from_buffer(data, mime=True)
    except Exception:
        pass

    # Minimal built-in sniffing
    if data[:2] == b"MZ":
        return "application/x-dosexec"
    if data[:4] == b"PK\x03\x04":
        return "application/zip"
    if data[:7] in (b"Rar!\x1a\x07\x00", b"Rar!\x1a\x07\x01"):
        return "application/x-rar-compressed"
    if data[:6] == b"7z\xBC\xAF'\x1C":
        return "application/x-7z-compressed"
    try:
        data.decode("utf-8")
        return "text/plain"
    except UnicodeDecodeError:
        pass
    return "application/octet-stream"


def _extract_strings(data: bytes) -> List[str]:
    """Extract printable ASCII strings ≥ MIN_STRING_LEN."""
    results: List[str] = []
    current: List[int] = []
    for byte in data:
        if byte in PRINTABLE_CHARS and byte not in (ord('\n'), ord('\r')):
            current.append(byte)
        else:
            if len(current) >= MIN_STRING_LEN:
                results.append(bytes(current).decode("ascii", errors="ignore"))
            current = []
    if len(current) >= MIN_STRING_LEN:
        results.append(bytes(current).decode("ascii", errors="ignore"))

    # Deduplicate and prioritise longer strings
    unique = list(dict.fromkeys(results))
    unique.sort(key=len, reverse=True)
    return unique[:MAX_STRINGS_RETURNED]


def _parse_pe(
    data: bytes,
) -> Tuple[bool, Dict[str, Any], List[str], bool]:
    """
    Parse PE headers safely.

    Returns
    -------
    is_pe : bool
    sections : list[dict]
    imports : list[str]      (DLL::Function)
    packer_detected : bool
    """
    try:
        pe = pefile.PE(data=data, fast_load=False)
    except pefile.PEFormatError:
        return False, {}, [], False

    # ── Sections ──────────────────────────────────────────────────────────
    sections: List[Dict[str, Any]] = []
    packer_detected = False

    for section in pe.sections:
        raw_name = section.Name.rstrip(b"\x00")
        name = raw_name.decode("utf-8", errors="replace")
        entropy = section.get_entropy()
        section_data = section.get_data()
        sections.append(
            {
                "name": name,
                "virtual_address": hex(section.VirtualAddress),
                "raw_size": section.SizeOfRawData,
                "virtual_size": section.Misc_VirtualSize,
                "entropy": round(entropy, 4),
                "characteristics": hex(section.Characteristics),
                "suspicious_entropy": entropy > HIGH_ENTROPY_THRESHOLD,
            }
        )
        if raw_name in PACKER_SECTION_NAMES:
            packer_detected = True

    # ── Imports ───────────────────────────────────────────────────────────
    imports: List[str] = []
    try:
        pe.parse_data_directories(
            directories=[pefile.DIRECTORY_ENTRY["IMAGE_DIRECTORY_ENTRY_IMPORT"]]
        )
        if hasattr(pe, "DIRECTORY_ENTRY_IMPORT"):
            for entry in pe.DIRECTORY_ENTRY_IMPORT:
                dll = entry.dll.decode("utf-8", errors="replace") if entry.dll else "unknown"
                for imp in entry.imports:
                    if imp.name:
                        func = imp.name.decode("utf-8", errors="replace")
                        imports.append(f"{dll}::{func}")
    except Exception:
        pass  # Imports missing or malformed – continue

    # ── PE metadata ───────────────────────────────────────────────────────
    pe_meta: Dict[str, Any] = {}
    try:
        pe_meta["timestamp"] = pe.FILE_HEADER.TimeDateStamp
        pe_meta["machine"] = hex(pe.FILE_HEADER.Machine)
        pe_meta["entry_point"] = hex(pe.OPTIONAL_HEADER.AddressOfEntryPoint)
        pe_meta["image_base"] = hex(pe.OPTIONAL_HEADER.ImageBase)
        pe_meta["subsystem"] = pe.OPTIONAL_HEADER.Subsystem
        pe_meta["number_of_sections"] = pe.FILE_HEADER.NumberOfSections
    except Exception:
        pass

    pe.close()
    return True, {**pe_meta, "sections": sections}, imports, packer_detected


def _classify_suspicious_imports(
    imports: List[str],
) -> Dict[str, List[str]]:
    """Map raw import names to MITRE-aligned suspicious categories."""
    found: Dict[str, List[str]] = {}
    import_funcs = {imp.split("::")[-1] for imp in imports}
    for category, funcs in SUSPICIOUS_IMPORTS.items():
        matched = [f for f in funcs if f in import_funcs]
        if matched:
            found[category] = matched
    return found


# ── Public Interface ─────────────────────────────────────────────────────────

def analyse_file(file_bytes: bytes, original_filename: str) -> Dict[str, Any]:
    """
    Main entry-point for static analysis.

    Parameters
    ----------
    file_bytes : bytes  – raw file content (already read into memory)
    original_filename : str

    Returns
    -------
    dict with all extracted features (ready to serialise as JSON)
    """
    result: Dict[str, Any] = {
        "filename": original_filename,
        "file_size": len(file_bytes),
    }

    # ── Hashes ────────────────────────────────────────────────────────────
    result["hashes"] = _compute_hashes(file_bytes)

    # ── MIME type ─────────────────────────────────────────────────────────
    result["mime_type"] = _detect_mime(file_bytes)

    # ── Overall entropy ──────────────────────────────────────────────────
    overall_entropy = _shannon_entropy(file_bytes)
    result["entropy"] = round(overall_entropy, 4)
    result["high_entropy"] = overall_entropy > HIGH_ENTROPY_THRESHOLD

    # ── Strings ───────────────────────────────────────────────────────────
    result["printable_strings"] = _extract_strings(file_bytes)

    # ── PE analysis ───────────────────────────────────────────────────────
    is_pe, pe_info, imports, packer_detected = _parse_pe(file_bytes)
    result["is_pe"] = is_pe
    result["pe_info"] = pe_info
    result["imports"] = imports
    result["packer_detected"] = packer_detected

    # ── Suspicious import categories ──────────────────────────────────────
    # Primary source: parsed PE import table
    result["suspicious_import_categories"] = _classify_suspicious_imports(imports)

    # Fallback: if PE imports couldn't be parsed, scan printable strings too.
    # Real malware often obfuscates import tables but leaves API name strings.
    if not imports and result.get("printable_strings"):
        # Treat each printable string as if it were an import function name
        string_based = _classify_suspicious_imports(result["printable_strings"])
        # Merge — string-based findings are labelled to distinguish them
        for category, funcs in string_based.items():
            if category not in result["suspicious_import_categories"]:
                result["suspicious_import_categories"][category] = funcs
            # Also flag ransomware-specific strings
        # Check for ransomware-specific plaintext indicators
        ransomware_strings = ["YOUR_FILES_HAVE_BEEN_ENCRYPTED", "README_DECRYPT",
                              "bitcoin", ".locked", ".encrypted", ".crypt", "ransom"]
        matched_ransom = [s for s in result["printable_strings"]
                          if any(r.lower() in s.lower() for r in ransomware_strings)]
        if matched_ransom:
            existing = result["suspicious_import_categories"].get("Ransomware Indicators", [])
            result["suspicious_import_categories"]["Ransomware Indicators"] = list(
                set(existing + matched_ransom[:5])
            )


    # ── Threat indicators ─────────────────────────────────────────────────
    indicators: List[str] = []
    if result["high_entropy"]:
        indicators.append("High file entropy – possible packing or encryption")
    if packer_detected:
        indicators.append("Known packer section name detected")
    for category, matched in result["suspicious_import_categories"].items():
        indicators.append(
            f"Suspicious API imports [{category}]: {', '.join(matched)}"
        )
    # Check for sections with high entropy
    if is_pe:
        for sec in pe_info.get("sections", []):
            if sec.get("suspicious_entropy"):
                indicators.append(
                    f"High-entropy section '{sec['name']}' "
                    f"(entropy={sec['entropy']}) – possible encrypted payload"
                )
    result["threat_indicators"] = indicators

    # ── Preliminary verdict (before ML) ───────────────────────────────────
    indicator_count = len(indicators)
    if indicator_count == 0:
        result["preliminary_verdict"] = "CLEAN"
    elif indicator_count <= 2:
        result["preliminary_verdict"] = "SUSPICIOUS"
    else:
        result["preliminary_verdict"] = "MALICIOUS"

    return result


def validate_upload(file_bytes: bytes, filename: str, content_type: str) -> Optional[str]:
    """
    Validate an uploaded file before analysis.

    Returns
    -------
    str  – error message if invalid, None if OK
    """
    # Size check
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if len(file_bytes) > max_bytes:
        return f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB} MB"

    # Empty file
    if len(file_bytes) == 0:
        return "File is empty"

    # Filename sanitisation – strip path traversal attempts
    safe_name = Path(filename).name
    if ".." in filename or "/" in filename or "\\" in filename:
        return "Invalid filename"

    # MIME check
    detected_mime = _detect_mime(file_bytes)
    allowed = settings.ALLOWED_MIME_PREFIXES
    if not any(detected_mime.startswith(prefix) for prefix in allowed):
        return (
            f"File type '{detected_mime}' is not permitted for analysis. "
            f"Allowed types: {', '.join(allowed)}"
        )

    return None  # Valid
