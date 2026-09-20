# MalGuard

> A transparent malware analysis dashboard and triage tool for Windows PE binaries.

**Live Demo:** [mal-guard.vercel.app](https://mal-guard.vercel.app/)  
**Backend API:** Hosted on Render  

---

## Why MalGuard?

Most antivirus and endpoint tools give you a simple binary answer: *"Clean"* or *"Infected"*. They rarely show you *why* a file was flagged, what suspicious functions it imports, or how its entropy compares to packed malware.

MalGuard is built to make binary inspection transparent and interactive. You drop a suspicious file in, and instead of just spitting out a generic score, it parses the PE headers, calculates byte entropy across sections, categorizes high-risk Windows API calls (like memory injection or crypto routines), runs a trained gradient-boosted classifier, and gives you a step-by-step incident response playbook.

---

## Key Features

- **SOC Telemetry Dashboard:** A quick glance at recent scans, clean vs. malicious ratios, and flagged indicators.
- **Deep Static File Analysis:**
  - Extracts PE headers, sections (`.text`, `.data`, `.rsrc`), and export/import tables without executing the file.
  - Calculates Shannon entropy ($0.0 - 8.0$) to detect packed code (UPX, ASPack) or encrypted payloads.
  - Flags suspicious Win32 API calls (`VirtualAllocEx`, `CreateRemoteThread`, `CryptEncrypt`, `IsDebuggerPresent`, etc.).
  - Calculates cryptographic hashes (`SHA-256`, `MD5`, `SHA-1`) for threat intelligence lookups.
- **ML Classification with Explainability:**
  - Uses a Gradient Boosting model trained on PE file characteristics to categorize threats into families (Ransomware, Trojan, Spyware, Worm, Benign).
  - Shows top feature contributions so you know exactly which heuristics drove the verdict.
- **MITRE ATT&CK Mapping:** Maps detected behaviors directly to MITRE tactics and techniques (e.g., T1055 Process Injection, T1486 Data Encrypted for Impact).
- **Incident Response Playbooks:** Built-in containment, eradication, and recovery steps for each major malware family.
- **Safe Simulation Sandbox:** An in-browser demonstration mode so you can see how detection triggers work without handling real-world malware.

---

## How It Works

```
                     ┌───────────────────────────────┐
                     │   Suspicious File (.exe/.dll) │
                     └───────────────┬───────────────┘
                                     │
                     ┌───────────────▼───────────────┐
                     │     Static Analysis Engine    │
                     │  - PE Header Parsing          │
                     │  - Shannon Entropy (0-8)      │
                     │  - Hash Generation            │
                     │  - Suspicious API Matching    │
                     └───────────────┬───────────────┘
                                     │
                     ┌───────────────▼───────────────┐
                     │     ML Classifier & Rules     │
                     │  - Gradient Boosting model    │
                     │  - MITRE ATT&CK technique map │
                     └───────────────┬───────────────┘
                                     │
                     ┌───────────────▼───────────────┐
                     │      MalGuard Dashboard       │
                     │  - Threat verdict & breakdown │
                     │  - Feature impact weights     │
                     │  - 4-Phase Response Playbook  │
                     └───────────────────────────────┘
```

---

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide Icons
- **Backend:** FastAPI (Python 3.11+), Uvicorn, SQLAlchemy (Async)
- **Binary Analysis:** `pefile`, `hashlib`, Python standard math for entropy
- **Machine Learning:** `scikit-learn` (GradientBoostingClassifier), `joblib`
- **Hosting:** Vercel (Frontend SPA) + Render (FastAPI Web Service)

---

## Project Structure

```text
malguard/
├── backend/
│   ├── backend/
│   │   ├── api/routes/         # API endpoints (analyze, diagnose, health)
│   │   ├── core/               # Database and environment config
│   │   ├── services/           # PE parser, entropy math, ML inference
│   │   └── schemas/            # Pydantic request/response models
│   ├── ml_models/              # Model training scripts and saved weights
│   ├── requirements.txt        # Python backend packages
│   └── Procfile                # Render deployment configuration
├── frontend/
│   ├── src/
│   │   ├── components/         # Modals, tables, stat cards, banners
│   │   ├── pages/              # Dashboard, Scanner, History, Encyclopedia, Sandbox
│   │   ├── services/api.js     # Axios API layer + offline fallback
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Local Setup

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it (Windows)
.\venv\Scripts\Activate.ps1
# Activate it (macOS / Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Retrain the ML model locally
python ml_models/training/train.py

# Run the API server
uvicorn backend.main:app --reload --port 8000
```

The API docs will be running at `http://localhost:8000/docs`.

### 2. Frontend Setup

```bash
cd frontend

# Install packages
npm install

# Start local dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Upload a binary file for static analysis & ML prediction |
| `GET` | `/api/reports` | Get recent scan audit history |
| `GET` | `/api/reports/{id}` | Get detailed report for a specific scan ID |
| `GET` | `/api/families` | Get malware family taxonomy and response playbooks |
| `GET` | `/api/health` | Healthcheck endpoint for monitoring uptime |

---

## MITRE ATT&CK Mapping

MalGuard maps static binary features to common adversary techniques:

| Technique | Name | What MalGuard Looks For |
|---|---|---|
| **T1027** | Obfuscated/Encrypted Files | Sections with Shannon entropy > 7.0, known UPX/packer headers |
| **T1055** | Process Injection | Imports like `VirtualAllocEx`, `WriteProcessMemory`, `CreateRemoteThread` |
| **T1057** | Process Discovery | Imports like `CreateToolhelp32Snapshot`, `Process32First` |
| **T1486** | Data Encrypted for Impact | Crypto APIs (`CryptEncrypt`, `CryptGenKey`, `CryptAcquireContext`) |
| **T1059** | Command & Scripting Interpreter | Process creation APIs (`ShellExecute`, `CreateProcessA`, `WinExec`) |

---

## Safety Note

MalGuard uses **purely static analysis**—it parses binary structure, bytes, and headers without actually launching or executing the file. Still, if you are testing real-world suspicious samples, always handle them inside a dedicated sandbox or isolated virtual machine.
