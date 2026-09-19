"""
Knowledge Base – MalGuard Modules 1, 4 & 5
============================================
Provides:
  * In-memory malware family knowledge base seeded from JSON
  * Symptom-matching engine (TF-IDF cosine similarity)
  * Playbook retrieval

The KB is loaded once at startup and can be refreshed from the database.
"""

import json
import math
import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

# ── Raw Knowledge Base (embedded JSON-like structure) ─────────────────────────

KNOWLEDGE_BASE: List[Dict[str, Any]] = [
    {
        "family": "Ransomware",
        "description": (
            "Ransomware encrypts victim files and demands a ransom for the decryption key. "
            "Modern variants use asymmetric cryptography and target backups to maximise pressure."
        ),
        "mitre_tactics": [
            "T1486 – Data Encrypted for Impact",
            "T1490 – Inhibit System Recovery",
            "T1489 – Service Stop",
            "T1083 – File and Directory Discovery",
        ],
        "symptoms": [
            "files renamed with strange or unknown extension",
            "ransom note text file on desktop",
            "cannot open documents images or videos",
            "desktop wallpaper changed to ransom demand",
            "backup files deleted or shadow copies removed",
            "high disk activity with cpu usage spike",
            "vssadmin delete shadows command ran",
        ],
        "iocs": [
            "High entropy files across user directories",
            "Presence of README_DECRYPT.txt or similar",
            "Registry key: HKCU\\Software\\Decryptor",
            "Outbound connections to .onion domains",
        ],
        "playbooks": [
            {
                "phase": "Contain",
                "step_order": 1,
                "title": "Isolate the infected host immediately",
                "description": (
                    "Disconnect the machine from the network (unplug Ethernet, disable Wi-Fi). "
                    "Do NOT power off – volatile evidence is needed. "
                    "If on a domain, isolate via firewall rule or VLAN reassignment."
                ),
            },
            {
                "phase": "Contain",
                "step_order": 2,
                "title": "Identify encryption scope",
                "description": (
                    "Run: `dir /s /a | findstr /i '.locked .encrypted .crypt'` to list affected files. "
                    "Check network shares for encrypted files to assess lateral spread."
                ),
            },
            {
                "phase": "Eradicate",
                "step_order": 3,
                "title": "Identify and remove the ransomware binary",
                "description": (
                    "Use a live OS (bootable USB) to scan with ClamAV or similar offline AV. "
                    "Identify the ransomware process via Autoruns or Task Manager startup entries. "
                    "Delete or quarantine the malicious executable."
                ),
            },
            {
                "phase": "Eradicate",
                "step_order": 4,
                "title": "Clean persistence mechanisms",
                "description": (
                    "Check `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run` for auto-start entries. "
                    "Remove scheduled tasks: `schtasks /query | findstr suspicious_name`. "
                    "Verify WMI subscriptions: `Get-WMIObject __EventFilter -Namespace root/subscription`."
                ),
            },
            {
                "phase": "Recover",
                "step_order": 5,
                "title": "Restore from clean backups",
                "description": (
                    "Before restoring, verify backup integrity and confirm the backup predates infection. "
                    "Restore to a freshly imaged or re-installed OS. "
                    "Test restore on a sandbox machine first."
                ),
            },
            {
                "phase": "Recover",
                "step_order": 6,
                "title": "Check decryptor availability",
                "description": (
                    "Visit https://www.nomoreransom.org to check if a free decryptor exists for the variant. "
                    "Submit sample hash to ID Ransomware (https://id-ransomware.malwarehunterteam.com)."
                ),
            },
            {
                "phase": "Prevent",
                "step_order": 7,
                "title": "Harden against future ransomware",
                "description": (
                    "Enable Controlled Folder Access (Windows Defender). "
                    "Implement offline/immutable backups (3-2-1 rule). "
                    "Disable RDP if unused; enforce MFA for remote access. "
                    "Apply application allowlisting with AppLocker or WDAC."
                ),
            },
        ],
    },
    {
        "family": "Trojan",
        "description": (
            "Trojans disguise themselves as legitimate software to trick users into execution. "
            "They typically establish a backdoor, exfiltrate data, or download additional payloads."
        ),
        "mitre_tactics": [
            "T1055 – Process Injection",
            "T1547 – Boot or Logon Autostart Execution",
            "T1071 – Application Layer Protocol (C2)",
            "T1041 – Exfiltration Over C2 Channel",
        ],
        "symptoms": [
            "antivirus alert for suspicious executable",
            "new unknown process running in task manager",
            "computer behaves slowly or sluggishly",
            "browser redirects to unknown websites",
            "unexpected network connections in netstat",
            "new user accounts created without authorization",
            "firewall disabled or security software killed",
        ],
        "iocs": [
            "Outbound connections on uncommon ports (4444, 1337, 8080)",
            "DLL injection into explorer.exe or svchost.exe",
            "Registry persistence in HKCU Run keys",
            "Unsigned executable in %AppData% or %Temp%",
        ],
        "playbooks": [
            {
                "phase": "Contain",
                "step_order": 1,
                "title": "Block C2 communications",
                "description": (
                    "Capture active connections: `netstat -nabo`. "
                    "Block outbound traffic to identified C2 IPs at the firewall. "
                    "Isolate the host from the rest of the network."
                ),
            },
            {
                "phase": "Eradicate",
                "step_order": 2,
                "title": "Terminate malicious processes",
                "description": (
                    "Identify malicious PID via Process Explorer (check parent process, file location). "
                    "Kill the process: `taskkill /f /pid <PID>`. "
                    "Delete the originating file and any DLLs it loaded."
                ),
            },
            {
                "phase": "Eradicate",
                "step_order": 3,
                "title": "Remove persistence",
                "description": (
                    "Use Autoruns (Sysinternals) to review all startup locations. "
                    "Remove malicious entries from registry, scheduled tasks, and services."
                ),
            },
            {
                "phase": "Recover",
                "step_order": 4,
                "title": "Reset credentials",
                "description": (
                    "Assume all credentials on the compromised host are exposed. "
                    "Reset passwords for all accounts, especially domain and privileged accounts. "
                    "Revoke and re-issue API keys and certificates."
                ),
            },
            {
                "phase": "Prevent",
                "step_order": 5,
                "title": "User training and email filtering",
                "description": (
                    "Deploy email sandboxing/attachment scanning. "
                    "Conduct phishing awareness training. "
                    "Enable SmartScreen and block execution from Temp/AppData with AppLocker."
                ),
            },
        ],
    },
    {
        "family": "Worm",
        "description": (
            "Worms self-replicate across networks without user interaction, spreading via "
            "network shares, removable media, or exploiting vulnerabilities."
        ),
        "mitre_tactics": [
            "T1210 – Exploitation of Remote Services",
            "T1021 – Remote Services",
            "T1091 – Replication Through Removable Media",
            "T1046 – Network Service Scanning",
        ],
        "symptoms": [
            "network traffic spikes or bandwidth saturation",
            "multiple machines infected in short timeframe",
            "duplicate files or autorun.inf on usb drives",
            "unusual port scans detected from internal hosts",
            "system slowdown due to worm propagation",
            "email client sending messages without user action",
        ],
        "iocs": [
            "autorun.inf on removable drives",
            "Repeated SMB port 445 connection attempts",
            "High volume outbound traffic on ports 25, 445, 139",
            "Identical file hashes found on multiple hosts",
        ],
        "playbooks": [
            {
                "phase": "Contain",
                "step_order": 1,
                "title": "Segment the network immediately",
                "description": (
                    "Identify all infected hosts via IDS/SIEM alerts. "
                    "Move infected hosts to a quarantine VLAN with no internet access. "
                    "Block internal lateral movement ports (445, 139, 135) between segments."
                ),
            },
            {
                "phase": "Contain",
                "step_order": 2,
                "title": "Disable removable media",
                "description": (
                    "Via Group Policy: Computer Configuration → Windows Settings → "
                    "Security Settings → Removable Storage Access → Deny All. "
                    "Scan all USB drives before re-enabling."
                ),
            },
            {
                "phase": "Eradicate",
                "step_order": 3,
                "title": "Patch the exploited vulnerability",
                "description": (
                    "Identify the CVE being exploited (e.g., EternalBlue for WannaCry). "
                    "Apply the relevant security patch to all systems. "
                    "Run vulnerability scanner to confirm patch status."
                ),
            },
            {
                "phase": "Recover",
                "step_order": 4,
                "title": "Clean and reimage infected hosts",
                "description": (
                    "Worms may have dropped additional payloads. "
                    "Reimage all confirmed-infected systems from a known-good image. "
                    "Restore data from pre-infection backups."
                ),
            },
            {
                "phase": "Prevent",
                "step_order": 5,
                "title": "Enforce patch management and network segmentation",
                "description": (
                    "Implement automated patch management (WSUS, SCCM, or Ansible). "
                    "Enforce least-privilege on network shares. "
                    "Deploy network-based IDS to detect worm propagation patterns."
                ),
            },
        ],
    },
    {
        "family": "Spyware",
        "description": (
            "Spyware silently monitors user activity, capturing keystrokes, screenshots, "
            "webcam feeds, and credentials, then exfiltrates them to remote servers."
        ),
        "mitre_tactics": [
            "T1056 – Input Capture (Keylogging)",
            "T1113 – Screen Capture",
            "T1125 – Video Capture",
            "T1003 – Credential Dumping",
        ],
        "symptoms": [
            "keyboard inputs lag or feel sluggish",
            "webcam indicator light activates unexpectedly",
            "browser history shows sites not visited",
            "passwords changed without user action",
            "strange outbound traffic to unknown servers",
            "antivirus reports keylogger or monitor tool",
            "high cpu or memory usage from unknown process",
        ],
        "iocs": [
            "Hooks on keyboard APIs (SetWindowsHookEx)",
            "Screenshots saved to hidden directory",
            "Regular HTTPS POSTs to unknown external IPs",
            "LSASS memory access from non-system processes",
        ],
        "playbooks": [
            {
                "phase": "Contain",
                "step_order": 1,
                "title": "Disconnect and preserve evidence",
                "description": (
                    "Take the system offline immediately to stop credential exfiltration. "
                    "Capture a memory image (using Magnet RAM Capture or WinPmem) before shutdown. "
                    "Log all recent outbound connections."
                ),
            },
            {
                "phase": "Eradicate",
                "step_order": 2,
                "title": "Remove spyware processes and files",
                "description": (
                    "Scan with Malwarebytes or similar offline tool. "
                    "Check for DLL side-loading in application directories. "
                    "Remove all identified spyware components."
                ),
            },
            {
                "phase": "Recover",
                "step_order": 3,
                "title": "Reset all potentially exposed credentials",
                "description": (
                    "Assume all typed credentials are compromised. "
                    "Reset passwords from a clean, uninfected machine. "
                    "Enable MFA on all critical accounts immediately."
                ),
            },
            {
                "phase": "Prevent",
                "step_order": 4,
                "title": "Deploy EDR and DLP solutions",
                "description": (
                    "Install an Endpoint Detection and Response (EDR) tool. "
                    "Enable Data Loss Prevention (DLP) rules for credential-type data. "
                    "Use a password manager to prevent keylogger capture of typed passwords."
                ),
            },
        ],
    },
    {
        "family": "Adware",
        "description": (
            "Adware displays unwanted advertisements, typically by injecting into browser sessions "
            "or installing rogue browser extensions. Usually lower severity but degrades performance."
        ),
        "mitre_tactics": [
            "T1176 – Browser Extensions",
            "T1112 – Modify Registry",
        ],
        "symptoms": [
            "excessive pop-up advertisements in browser",
            "browser homepage changed without permission",
            "unknown browser extension or toolbar installed",
            "search engine changed to unknown provider",
            "ads appear on websites that normally dont show ads",
            "browser performance is slow",
        ],
        "iocs": [
            "Unknown extension in chrome://extensions",
            "Modified browser shortcut target URL",
            "Registry entries for browser hijacker",
        ],
        "playbooks": [
            {
                "phase": "Eradicate",
                "step_order": 1,
                "title": "Remove browser extensions and reset browser",
                "description": (
                    "Identify and remove rogue extensions from all browsers. "
                    "Reset browser settings to default (Settings → Reset). "
                    "Clear browser cache and cookies."
                ),
            },
            {
                "phase": "Eradicate",
                "step_order": 2,
                "title": "Uninstall adware applications",
                "description": (
                    "Check Programs & Features for recently installed unknown applications. "
                    "Run AdwCleaner for thorough adware removal. "
                    "Clean registry entries associated with the adware."
                ),
            },
            {
                "phase": "Prevent",
                "step_order": 3,
                "title": "Use an ad-blocker and restrict extension installs",
                "description": (
                    "Install uBlock Origin. "
                    "Via Group Policy, restrict browser extension installations to an approved list. "
                    "Use DNS-based filtering (e.g., Pi-hole) to block ad networks."
                ),
            },
        ],
    },
]


# ── TF-IDF Symptom Matcher ────────────────────────────────────────────────────

def _tokenise(text: str) -> List[str]:
    """Lowercase, strip punctuation, split to tokens."""
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    return [t for t in text.split() if len(t) > 2]


def _build_tfidf(corpus: List[List[str]]) -> Tuple[List[str], List[List[float]]]:
    """Build a minimal TF-IDF matrix from a list of token lists."""
    vocab: Dict[str, int] = {}
    for tokens in corpus:
        for tok in tokens:
            if tok not in vocab:
                vocab[tok] = len(vocab)

    N = len(corpus)
    doc_freq: Dict[int, int] = {i: 0 for i in vocab.values()}
    for tokens in corpus:
        for tok in set(tokens):
            doc_freq[vocab[tok]] += 1

    idf: Dict[int, float] = {
        idx: math.log((1 + N) / (1 + df)) + 1
        for idx, df in doc_freq.items()
    }

    def tfidf_vec(tokens: List[str]) -> List[float]:
        tf: Dict[int, float] = {}
        for tok in tokens:
            if tok in vocab:
                idx = vocab[tok]
                tf[idx] = tf.get(idx, 0) + 1
        n = len(tokens) or 1
        vec = [tf.get(i, 0.0) / n * idf[i] for i in range(len(vocab))]
        norm = math.sqrt(sum(v * v for v in vec)) or 1.0
        return [v / norm for v in vec]

    matrix = [tfidf_vec(tokens) for tokens in corpus]
    return list(vocab.keys()), matrix


class SymptomMatcher:
    """Matches free-text symptom descriptions to known malware families."""

    def __init__(self, kb: List[Dict[str, Any]]) -> None:
        self.kb = kb
        self._build_index()

    def _build_index(self) -> None:
        """Pre-compute TF-IDF vectors for all symptom corpora."""
        self._family_symptom_texts: List[str] = []
        self._family_indices: List[int] = []

        for i, entry in enumerate(self.kb):
            combined = " ".join(entry.get("symptoms", []))
            combined += " " + entry.get("description", "")
            self._family_symptom_texts.append(combined)
            self._family_indices.append(i)

        tokenised = [_tokenise(t) for t in self._family_symptom_texts]
        self._vocab, self._tfidf_matrix = _build_tfidf(tokenised)

    def _query_vector(self, query: str) -> List[float]:
        tokens = _tokenise(query)
        vocab_map = {tok: i for i, tok in enumerate(self._vocab)}
        tf: Dict[int, float] = {}
        for tok in tokens:
            if tok in vocab_map:
                idx = vocab_map[tok]
                tf[idx] = tf.get(idx, 0) + 1
        n = len(tokens) or 1
        vec_size = len(self._vocab)
        # Simplified IDF re-use from matrix dimension
        raw = [tf.get(i, 0.0) / n for i in range(vec_size)]
        norm = math.sqrt(sum(v * v for v in raw)) or 1.0
        return [v / norm for v in raw]

    def _cosine(self, a: List[float], b: List[float]) -> float:
        return sum(x * y for x, y in zip(a, b))

    def match(
        self, symptom_text: str, top_k: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Match a symptom description to the most likely malware family.

        Returns
        -------
        list of dicts: [{family, confidence, description, playbook, mitre_tactics}]
        """
        q_vec = self._query_vector(symptom_text)
        scores = [
            self._cosine(q_vec, doc_vec)
            for doc_vec in self._tfidf_matrix
        ]

        # Sort by score descending
        ranked = sorted(
            enumerate(scores), key=lambda x: x[1], reverse=True
        )[:top_k]

        results = []
        for idx, score in ranked:
            entry = self.kb[idx]
            results.append(
                {
                    "family": entry["family"],
                    "confidence": round(score, 4),
                    "description": entry["description"],
                    "mitre_tactics": entry.get("mitre_tactics", []),
                    "iocs": entry.get("iocs", []),
                    "symptoms_matched": entry.get("symptoms", []),
                    "playbook": entry.get("playbooks", []),
                }
            )
        return results


# Singleton instance loaded at module import
symptom_matcher = SymptomMatcher(KNOWLEDGE_BASE)


def get_family_info(family_name: str) -> Optional[Dict[str, Any]]:
    """Retrieve full knowledge-base entry for a specific family."""
    for entry in KNOWLEDGE_BASE:
        if entry["family"].lower() == family_name.lower():
            return entry
    return None


def get_playbook(family_name: str) -> List[Dict[str, Any]]:
    """Return ordered playbook steps for a given malware family."""
    entry = get_family_info(family_name)
    if not entry:
        return []
    return sorted(entry.get("playbooks", []), key=lambda x: x["step_order"])
