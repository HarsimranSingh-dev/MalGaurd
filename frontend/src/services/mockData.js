// Mock Database & SOC Telemetry for MalGuard

export const mockDashboardStats = {
  totalScans: 1482,
  threatsFound: 247,
  cleanFiles: 1156,
  suspiciousFiles: 79,
  threatPercentage: "16.7%",
  cleanPercentage: "78.0%",
  activeShields: "Protected",
  threatLevel: "ELEVATED",
  socLiveStatus: "Active Heuristic EDR v3.4"
};

export const mockScanTimeline = [
  { time: '00:00', total: 45, malicious: 6, clean: 36, suspicious: 3 },
  { time: '04:00', total: 32, malicious: 4, clean: 27, suspicious: 1 },
  { time: '08:00', total: 110, malicious: 18, clean: 85, suspicious: 7 },
  { time: '12:00', total: 185, malicious: 34, clean: 140, suspicious: 11 },
  { time: '16:00', total: 240, malicious: 42, clean: 186, suspicious: 12 },
  { time: '20:00', total: 160, malicious: 28, clean: 124, suspicious: 8 },
  { time: 'Now', total: 85, malicious: 15, clean: 65, suspicious: 5 },
];

export const mockThreatCategories = [
  { name: 'Ransomware', count: 98, color: '#ef4444' },
  { name: 'Trojans', count: 64, color: '#f97316' },
  { name: 'Infostealers', count: 47, color: '#a855f7' },
  { name: 'Adware/PUP', count: 26, color: '#eab308' },
  { name: 'Worms/Rootkits', count: 12, color: '#ec4899' },
];

export const mockRecentScans = [
  {
    id: "scan-9901",
    filename: "invoice_payment_2026.exe",
    verdict: "MALICIOUS",
    aiPrediction: "Ransomware.LockBit3.gen",
    confidence: 98.4,
    entropy: 7.84,
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    md5: "8743b52063cd84097a65d1633f5c74f5",
    fileSize: "2.4 MB",
    timestamp: "2026-09-19 22:45:10",
    mitreTactics: [
      { id: "T1486", name: "Data Encrypted for Impact", phase: "Impact" },
      { id: "T1059", name: "Command and Scripting Interpreter", phase: "Execution" },
      { id: "T1490", name: "Inhibit System Recovery", phase: "Impact" },
      { id: "T1027", name: "Obfuscated Files or Information", phase: "Defense Evasion" }
    ],
    threatIndicators: [
      "High Shannon entropy (7.84/8.0) indicating encrypted payload or packed section (.vmp0)",
      "Calls 'vssadmin.exe Delete Shadows /All /Quiet' to block system restore",
      "Dynamic API resolution through PEB traversal avoiding static import table",
      "CryptoAPI calls to CryptGenKey, CryptExportKey and CryptEncrypt",
      "Network beacon attempt to 194.26.29.112:8443 (Known LockBit C2)"
    ]
  },
  {
    id: "scan-9902",
    filename: "ChromeSetup_x64.exe",
    verdict: "CLEAN",
    aiPrediction: "Safe PE Executable (Google LLC)",
    confidence: 99.9,
    entropy: 5.62,
    sha256: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9",
    md5: "c4ca4238a0b923820dcc509a6f75849b",
    fileSize: "1.2 MB",
    timestamp: "2026-09-19 22:15:30",
    mitreTactics: [],
    threatIndicators: [
      "Valid Authenticode digital signature verified by Google LLC Root CA",
      "Normal entropy across all PE sections (.text, .rdata, .data, .rsrc)",
      "Standard Win32 API imports without memory injection primitives",
      "No anti-debugging or sandbox evasion heuristics detected"
    ]
  },
  {
    id: "scan-9903",
    filename: "driver_fix_patch.dll",
    verdict: "SUSPICIOUS",
    aiPrediction: "Obfuscated Loader / Downloader",
    confidence: 79.1,
    entropy: 7.15,
    sha256: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    md5: "eccbc87e4b5ce2fe28308fd9f2a7baf3",
    fileSize: "480 KB",
    timestamp: "2026-09-19 21:50:02",
    mitreTactics: [
      { id: "T1027", name: "Obfuscated Files or Information", phase: "Defense Evasion" },
      { id: "T1105", name: "Ingress Tool Transfer", phase: "Command and Control" }
    ],
    threatIndicators: [
      "Moderate high entropy in .rdata section (7.15)",
      "Missing code signing signature from recognized vendor",
      "Dynamic load of WinHttpOpen and URLDownloadToFileW",
      "Sleep call evasion loop detected (delayed execution > 120s)"
    ]
  },
  {
    id: "scan-9904",
    filename: "discord_nitro_gift.scr",
    verdict: "MALICIOUS",
    aiPrediction: "Spyware.RedLineStealer",
    confidence: 97.2,
    entropy: 7.92,
    sha256: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    md5: "a87ff679a2f3e71d9181a67b7542122c",
    fileSize: "750 KB",
    timestamp: "2026-09-19 20:32:18",
    mitreTactics: [
      { id: "T1555", name: "Credentials from Password Stores", phase: "Credential Access" },
      { id: "T1005", name: "Data from Local System", phase: "Collection" },
      { id: "T1041", name: "Exfiltration Over C2 Channel", phase: "Exfiltration" },
      { id: "T1056", name: "Input Capture (Keylogging)", phase: "Collection" }
    ],
    threatIndicators: [
      "Scans '%APPDATA%\\Google\\Chrome\\User Data\\Default\\Login Data' sqlite database",
      "Extracts cryptocurrency wallet directories (Metamask, Exodus, Binance)",
      "Captures desktop screenshots via GDI32 BitBlt API",
      "Compresses stolen credentials into temp zip and transmits via HTTP POST"
    ]
  },
  {
    id: "scan-9905",
    filename: "putty-64bit-0.81.msi",
    verdict: "CLEAN",
    aiPrediction: "Legitimate Network Utility",
    confidence: 99.5,
    entropy: 5.75,
    sha256: "ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb",
    md5: "e4da3b7fbbce2345d7772b0674a318d5",
    fileSize: "3.6 MB",
    timestamp: "2026-09-19 18:22:44",
    mitreTactics: [],
    threatIndicators: [
      "Authenticode signature valid from Simon Tatham",
      "Clean VirusTotal lookup score 0/72 engines",
      "No persistence mechanisms or scheduled task creations"
    ]
  },
  {
    id: "scan-9906",
    filename: "procmon64.exe",
    verdict: "CLEAN",
    aiPrediction: "Sysinternals Administrative Tool",
    confidence: 99.2,
    entropy: 6.20,
    sha256: "2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6",
    md5: "1679091c5a880faf6fb5e6087eb1b2dc",
    fileSize: "4.1 MB",
    timestamp: "2026-09-19 16:11:05",
    mitreTactics: [],
    threatIndicators: [
      "Signed by Microsoft Windows Publisher",
      "Kernel driver verified and signed via WHQL",
      "Legitimate diagnostic utility"
    ]
  },
  {
    id: "scan-9907",
    filename: "win_optimizer_speedup.exe",
    verdict: "SUSPICIOUS",
    aiPrediction: "Adware.PUP.OptimizerPro",
    confidence: 82.3,
    entropy: 6.94,
    sha256: "185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969",
    md5: "8f14e45fceea167a5a36dedd4bea2543",
    fileSize: "8.5 MB",
    timestamp: "2026-09-19 14:02:19",
    mitreTactics: [
      { id: "T1547", name: "Boot or Logon Autostart Execution", phase: "Persistence" },
      { id: "T1114", name: "Email Collection / Browser Tracking", phase: "Collection" }
    ],
    threatIndicators: [
      "Adds Run registry key in HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
      "Modifies default DNS and search provider in Chromium preferences",
      "Spawns background banner advertising popups without user consent"
    ]
  }
];

export const mockMalwareFamilies = [
  {
    id: "ransomware",
    name: "Ransomware",
    tagline: "High-impact cryptographic extortion software",
    severity: "CRITICAL",
    color: "#ef4444",
    icon: "Lock",
    aliases: ["LockBit 3.0", "WannaCry", "BlackCat (ALPHV)", "Phobos", "Conti"],
    description: "Ransomware targets critical files, documents, and databases using military-grade encryption (AES-256 + RSA-4096), destroying volume shadow copies and demanding ransom payments in cryptocurrency for decryption keys.",
    mitreTactics: [
      { id: "T1486", name: "Data Encrypted for Impact" },
      { id: "T1490", name: "Inhibit System Recovery" },
      { id: "T1059", name: "Command & Scripting" },
      { id: "T1070", name: "Indicator Removal" }
    ],
    indicators: [
      "Files renamed with weird extensions (.lockbit, .wncry, .locked)",
      "Shadow copies wiped via 'vssadmin delete shadows /all /quiet'",
      "Desktop background replaced with extortion banner",
      "Disabled Windows Recovery and SafeBoot configurations"
    ],
    playbook: {
      contain: [
        { id: "c1", title: "Immediately Isolate Endpoint from Network", text: "Pull Ethernet cable and disable Wi-Fi/Bluetooth immediately to prevent lateral encryption spreading across shares." },
        { id: "c2", title: "Preserve Volatile Memory (RAM)", text: "Do not power down if possible; dump memory using FTK Imager or WinPmem to capture encryption keys still in RAM." },
        { id: "c3", title: "Block C2 IP/Domains at Firewall", text: "Identify outbound communication IP addresses and enforce boundary firewall blacklists." }
      ],
      eradicate: [
        { id: "e1", title: "Boot into Safe Mode with Command Prompt", text: "Prevent automatic persistence hooks from executing during boot." },
        { id: "e2", title: "Purge Malicious Registry Run Keys", text: "Check HKLM and HKCU \\Software\\Microsoft\\Windows\\CurrentVersion\\Run and RunOnce for payload executables." },
        { id: "e3", title: "Terminate & Delete Binaries in %TEMP% / %APPDATA%", text: "Locate dropper binaries, task schedulers, and batch scripts and shred securely." }
      ],
      recover: [
        { id: "r1", title: "Assess Backup Integrity", text: "Verify that immutable offline or air-gapped backups are uncompromised before connecting to network." },
        { id: "r2", title: "Reimage or Restore from Known Good Snapshot", text: "Wipe infected partitions and restore system image from pre-incident baseline." },
        { id: "r3", title: "Force Enterprise Credential Rotation", text: "Reset Kerberos krbtgt, Domain Admin, and local Administrator account credentials." }
      ],
      prevent: [
        { id: "p1", title: "Disable SMBv1 & Restrict RDP Exposure", text: "Block inbound RDP port 3389 at internet gateway; require VPN with MFA." },
        { id: "p2", title: "Implement Automated Immutable Snapshots", text: "Ensure daily snapshots have write-once-read-many (WORM) cloud retention." },
        { id: "p3", title: "Deploy EDR Behavioral Anti-Ransomware Shields", text: "Configure canary files and rapid mass file modification tripwires." }
      ]
    }
  },
  {
    id: "trojan",
    name: "Trojan",
    tagline: "Deceptive backdoor granting unauthorized remote control",
    severity: "HIGH",
    color: "#f97316",
    icon: "ShieldAlert",
    aliases: ["Emotet", "Qakbot", "AgentTesla", "TrickBot", "Remcos RAT"],
    description: "Trojans disguise themselves as legitimate software, email attachments, or software updates. Once executed, they establish covert reverse shells (Command & Control), drop secondary payloads, and facilitate remote persistence.",
    mitreTactics: [
      { id: "T1204", name: "User Execution: Malicious File" },
      { id: "T1071", name: "Application Layer Protocol C2" },
      { id: "T1547", name: "Boot or Logon Autostart" },
      { id: "T1055", name: "Process Injection" }
    ],
    indicators: [
      "Unknown outbound TCP connections on ports 443, 8080, 4444 to unrecognized IP ranges",
      "Process hollowing into svchost.exe or explorer.exe",
      "Unfamiliar scheduled tasks running disguised scripts (.vbs, .ps1, .bat)",
      "Disabled Windows Defender Real-Time Monitoring"
    ],
    playbook: {
      contain: [
        { id: "c1", title: "Sever C2 Connection", text: "Cut network connection or isolate VLAN to terminate active remote shell sessions." },
        { id: "c2", title: "Kill Injected Parent and Child Processes", text: "Use Process Explorer to find suspicious svchost.exe without parent services.exe." },
        { id: "c3", title: "Disable Compromised User Account", text: "Temporarily lock the logged-in user account in Active Directory." }
      ],
      eradicate: [
        { id: "e1", title: "Sweep Scheduled Tasks (schtasks)", text: "Inspect all tasks created within the last 7 days and delete unauthorized triggers." },
        { id: "e2", title: "Remove DLL Hijacking Drop-Ins", text: "Check application folders for unauthorized version.dll, winmm.dll, or uxtheme.dll." },
        { id: "e3", title: "Full EDR / Antivirus Offline Scan", text: "Perform thorough heuristic sweep in Windows Defender Offline mode." }
      ],
      recover: [
        { id: "r1", title: "Audit File Access Logs", text: "Inspect what sensitive shares and directories were accessed during the Trojan session." },
        { id: "r2", title: "Reset Session Tokens and Passwords", text: "Revoke active web session cookies and change account passwords." },
        { id: "r3", title: "Restore Modified System Binaries", text: "Run 'sfc /scannow' and 'DISM /Online /Cleanup-Image /RestoreHealth'." }
      ],
      prevent: [
        { id: "p1", title: "Deploy Script Execution Policies", text: "Enforce ConstrainedLanguageMode in PowerShell and block macro execution via GPO." },
        { id: "p2", title: "Email Gateway Sandboxing", text: "Block executable and archive extensions (.exe, .scr, .iso, .vhd) at mail boundary." },
        { id: "p3", title: "Attack Surface Reduction (ASR) Rules", text: "Enable Windows Defender ASR rules against child process spawning from Office." }
      ]
    }
  },
  {
    id: "infostealer",
    name: "Spyware / Infostealer",
    tagline: "Covert credential harvesting and surveillance payload",
    severity: "HIGH",
    color: "#a855f7",
    icon: "Eye",
    aliases: ["RedLine", "Vidar", "Raccoon Stealer", "Pegasus", "Lumma Stealer"],
    description: "Infostealers silently comb through local browsers, email clients, cryptocurrency wallets, VPN profiles, and FTP clients to extract saved passwords, session cookies, autofill data, and private cryptographic keys.",
    mitreTactics: [
      { id: "T1555", name: "Credentials from Password Stores" },
      { id: "T1539", name: "Steal Web Session Cookie" },
      { id: "T1005", name: "Data from Local System" },
      { id: "T1041", name: "Exfiltration Over C2 Channel" }
    ],
    indicators: [
      "Access spikes to Chrome, Edge, and Firefox SQLite database files (Login Data, Cookies)",
      "Compressed ZIP or CAB files generated in %TEMP% folder",
      "Telegram Bot API or Discord Webhook exfiltration traffic",
      "Unauthorized clipboard monitoring and keystroke logging"
    ],
    playbook: {
      contain: [
        { id: "c1", title: "Terminate Web Browser & Vault Sessions", text: "Kill all browser instances to lock database access." },
        { id: "c2", title: "Revoke Cloud & SaaS Sessions Instantly", text: "Log out of all Google, Microsoft 365, GitHub, and AWS accounts via admin console." },
        { id: "c3", title: "Block Exfiltration Gateways", text: "Null-route known Telegram bot API or Discord webhooks used as drop endpoints." }
      ],
      eradicate: [
        { id: "e1", title: "Remove Spyware Droppers in User Profiles", text: "Scour %LOCALAPPDATA% and %APPDATA% for hidden executables and startup scripts." },
        { id: "e2", title: "Clear Browser Extensions", text: "Remove unrecognized side-loaded Chrome/Edge extensions that persist monitoring." },
        { id: "e3", title: "Scan for Keylogger Hooks", text: "Verify WH_KEYBOARD_LL global hooks are eliminated." }
      ],
      recover: [
        { id: "r1", title: "Migrate Cryptocurrency Wallets to Hardware Vault", text: "Immediately sweep funds from hot software wallets to cold hardware devices." },
        { id: "r2", title: "Rotate All Passwords from a Clean Device", text: "Do not use the infected machine to change passwords; use an uncompromised system." },
        { id: "r3", title: "Enable Multi-Factor Authentication (FIDO2/WebAuthn)", text: "Transition accounts to hardware security keys resistant to cookie replay." }
      ],
      prevent: [
        { id: "p1", title: "Enforce Hardware-Bound Passkeys", text: "Minimize reliance on stored plain browser passwords; utilize enterprise SSO." },
        { id: "p2", title: "Enable Application Whitelisting (WDAC)", text: "Prevent unauthorized binaries from running out of AppData or Temp folders." },
        { id: "p3", title: "Data Loss Prevention (DLP) Policies", text: "Block bulk file zip creation and outbound uploads of database files." }
      ]
    }
  },
  {
    id: "worm",
    name: "Worm",
    tagline: "Self-propagating autonomous network malware",
    severity: "CRITICAL",
    color: "#ec4899",
    icon: "Network",
    aliases: ["Stuxnet", "Conficker", "ILOVEYOU", "Mirai", "WannaMine"],
    description: "Worms replicate autonomously across local networks, shared drives, USB drives, and unpatched remote services (like SMB, RPC, or SSH) without requiring direct user action, rapidly saturating bandwidth and compromising entire subnets.",
    mitreTactics: [
      { id: "T1080", name: "Taint Shared Content" },
      { id: "T1210", name: "Exploitation of Remote Services" },
      { id: "T1091", name: "Replication Through Removable Media" },
      { id: "T1046", name: "Network Service Scanning" }
    ],
    indicators: [
      "Rapid spikes in broadcast traffic and port scans across subnet (ports 445, 139, 135)",
      "Unfamiliar shortcut (.lnk) files on USB flash drives hiding executable binaries",
      "Network shares filled with copies of autorun.inf or executable duplicates",
      "Network switch CPU utilization reaching 100%"
    ],
    playbook: {
      contain: [
        { id: "c1", title: "Isolate Entire Subnet / Disable Inter-VLAN Routing", text: "Quarantine the affected switch ports or network segment to contain spread." },
        { id: "c2", title: "Block Inbound Ports 445/139/135 at Host Firewalls", text: "Push emergency Windows Firewall rule blocking SMB and RPC between workstations." },
        { id: "c3", title: "Disable AutoRun & AutoPlay Globally", text: "Deploy group policy disabling execution from removable media across all hosts." }
      ],
      eradicate: [
        { id: "e1", title: "Clean Network Shares and Shared Volumes", text: "Scan and sanitize shared network drives of replicated infected files." },
        { id: "e2", title: "Deploy Automated Removal Script via GPO/SCCM", text: "Push batch eradication commands to all subnet endpoints simultaneously." },
        { id: "e3", title: "Scan Removable Flash Media", text: "Quarantine any USB drives plugged into workstations during outbreak." }
      ],
      recover: [
        { id: "r1", title: "Verify Network Baseline Traffic", text: "Monitor Wireshark/NetFlow captures until anomalous SYN scans subside." },
        { id: "r2", title: "Re-enable VLAN Interfaces Gradually", text: "Reconnect verified clean hosts one by one while monitoring SIEM alerts." },
        { id: "r3", title: "Audit Share Permissions", text: "Remove overly permissive write access from anonymous and non-admin groups." }
      ],
      prevent: [
        { id: "p1", title: "Aggressive Patch Management", text: "Apply critical OS security patches (e.g. MS17-010 equivalents) within 24 hours." },
        { id: "p2", title: "Zero Trust Network Segmentation (Microsegmentation)", text: "Disallow peer-to-peer workstation communication across client subnets." },
        { id: "p3", title: "Block USB Removable Storage Execution", text: "Enforce read-only USB policies or complete flash storage blocking for endpoints." }
      ]
    }
  },
  {
    id: "adware",
    name: "Adware & Potentially Unwanted Programs (PUP)",
    tagline: "Persistent browser hijacking and advertising injection",
    severity: "MEDIUM",
    color: "#eab308",
    icon: "Megaphone",
    aliases: ["Fireball", "InstallCore", "Conduit Search", "DealPly", "Mindspark"],
    description: "Adware bundles with freeware to hijack browser search engines, inject intrusive pop-under advertisements, track browsing habits, and install root certificates to inspect encrypted HTTPS traffic.",
    mitreTactics: [
      { id: "T1176", name: "Browser Extensions & Helper Objects" },
      { id: "T1547", name: "Boot or Logon Autostart" },
      { id: "T1553", name: "Subvert Trust Controls: Install Root Cert" }
    ],
    indicators: [
      "Browser default search engine changed to unknown provider",
      "Persistent banner popups appearing outside browser windows",
      "New proxy settings configured pointing to 127.0.0.1:port",
      "Unfamiliar enterprise policies installed in Chrome/Edge"
    ],
    playbook: {
      contain: [
        { id: "c1", title: "Terminate Adware Background Daemons", text: "Identify updater processes in Task Manager and end process trees." },
        { id: "c2", title: "Disable Malicious Browser Extensions", text: "Open chrome://extensions or edge://extensions and toggle developer mode to inspect IDs." }
      ],
      eradicate: [
        { id: "e1", title: "Reset Browser to Clean Defaults", text: "Use browser 'Reset settings' feature to clear cookies, homepages, and shortcuts." },
        { id: "e2", title: "Remove Root Certificates", text: "Check certmgr.msc under Trusted Root Certification Authorities for fake certificates." },
        { id: "e3", title: "Uninstall Bundled Software in Control Panel", text: "Sort installed programs by install date and remove suspicious toolbars." }
      ],
      recover: [
        { id: "r1", title: "Verify Shortcut Targets", text: "Inspect desktop and taskbar shortcuts to ensure 'http://...' arguments weren't appended." },
        { id: "r2", title: "Restore Host File to Default", text: "Inspect C:\\Windows\\System32\\drivers\\etc\\hosts for malicious redirections." }
      ],
      prevent: [
        { id: "p1", title: "Use Ad-Blockers & DNS Filtering", text: "Deploy uBlock Origin and configure NextDNS / Pi-hole ad-blocking resolvers." },
        { id: "p2", title: "Standard User Accounts", text: "Prevent staff from running as local Administrators to curb bundleware installations." }
      ]
    }
  },
  {
    id: "rootkit",
    name: "Rootkit",
    tagline: "Stealth kernel-level subversion and anti-detection persistence",
    severity: "CRITICAL",
    color: "#dc2626",
    icon: "Terminal",
    aliases: ["ZeroAccess", "TDSS / TDL4", "Rustock", "Necurs", "Scaphoid"],
    description: "Rootkits infiltrate ring 0 (kernel space) or master boot records (MBR/UEFI) to hide processes, network sockets, and files from standard operating system APIs, making them virtually invisible to standard task managers and anti-malware tools.",
    mitreTactics: [
      { id: "T1542", name: "Pre-OS Boot / Firmware Rootkit" },
      { id: "T1014", name: "Rootkit API Hooking" },
      { id: "T1068", name: "Exploitation for Privilege Escalation" }
    ],
    indicators: [
      "Hidden processes visible in hardware virtualization logs but invisible in Windows Task Manager",
      "Secure Boot violations or modified UEFI boot loaders",
      "Antivirus services failing to start with access denied errors even for SYSTEM account",
      "System crashes (BSOD) with DRIVER_IRQL_NOT_LESS_OR_EQUAL"
    ],
    playbook: {
      contain: [
        { id: "c1", title: "Immediate Cold Power Off", text: "Prevent kernel rootkit from flashing persistent firmware or wiping forensics." },
        { id: "c2", title: "Physical Network Quarantine", text: "Remove network connectivity to deny stealth backdoors." }
      ],
      eradicate: [
        { id: "e1", title: "Boot from Trusted Clean USB Media", text: "Boot into a trusted WinPE / Linux rescue environment to bypass the infected host OS kernel." },
        { id: "e2", title: "Reflash UEFI Firmware & Enable Secure Boot", text: "Update Motherboard BIOS/UEFI from authentic vendor payload." },
        { id: "e3", title: "Full Disk Wipe (Clean Reinstall)", text: "Do not attempt piecemeal cleaning; perform low-level disk sanitization." }
      ],
      recover: [
        { id: "r1", title: "Install Clean Operating System from Verified Media", text: "Deploy hardened base image." },
        { id: "r2", title: "Verify Hardware Security Features", text: "Enable TPM 2.0, Secure Boot, and Memory Integrity (HVCI)." }
      ],
      prevent: [
        { id: "p1", title: "Mandatory Secure Boot & UEFI Passwords", text: "Protect firmware settings with administrative passwords." },
        { id: "p2", title: "Driver Signature Enforcement (WHQL)", text: "Block unsigned kernel-mode drivers from loading." },
        { id: "p3", title: "Kernel DMA Protection", text: "Enable IOMMU-based DMA protection to guard against direct memory attacks." }
      ]
    }
  }
];

export const mockSymptomPresets = [
  {
    label: "Ransomware Alert",
    query: "All my personal documents suddenly have a .lock extension and there's a ransom note file called README_DECRYPT.txt on the desktop. System restore was deleted.",
    family: "Ransomware",
    confidence: 97.8
  },
  {
    label: "Suspicious Remote Shell / Trojan",
    query: "Noticed a blank PowerShell console opening repeatedly on startup. High CPU usage and strange outbound network traffic connecting to an unknown foreign IP address on port 4444.",
    family: "Trojan",
    confidence: 94.2
  },
  {
    label: "Credential Stealer / Spyware",
    query: "I got logged out of Discord and Google Chrome unexpectedly. Received warnings about unauthorized login attempts from Russia, and crypto wallet app reported session token invalid.",
    family: "Spyware / Infostealer",
    confidence: 96.5
  },
  {
    label: "Adware / Browser Hijack",
    query: "My default search engine keeps redirecting to an unfamiliar URL full of advertisements. Random advertising popups appear even when Chrome is closed.",
    family: "Adware & Potentially Unwanted Programs (PUP)",
    confidence: 91.0
  },
  {
    label: "Worm / Network Propagation",
    query: "Plugged in a colleague's USB drive and now all my folders turned into .lnk shortcut files. Other computers on the local office Wi-Fi are reporting identical symptoms.",
    family: "Worm",
    confidence: 95.1
  }
];
