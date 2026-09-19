# 🛡️ MalGuard – Malware Analysis & Response Platform

> **Production-ready FastAPI backend with static analysis engine, ML classifier, MITRE ATT&CK mapping, and remediation playbooks.**

---

## Architecture Overview

```
malguard/
├── backend/
│   ├── main.py                      # FastAPI app factory + lifespan
│   ├── core/
│   │   ├── config.py                # Pydantic-settings configuration
│   │   └── database.py              # SQLAlchemy async ORM + models
│   ├── api/routes/
│   │   ├── analyze.py               # POST /api/analyze
│   │   └── diagnose.py              # POST /api/diagnose, GET /api/families
│   ├── services/
│   │   ├── static_analysis.py       # Module 2: hashes, entropy, PE, strings
│   │   ├── ml_classifier.py         # Module 3: GBT + SHAP + MITRE
│   │   └── knowledge_base.py        # Modules 1,4,5: KB + TF-IDF + playbooks
│   └── schemas/
│       └── schemas.py               # All Pydantic v2 request/response models
├── ml_models/
│   ├── artifacts/                   # Persisted .joblib model files
│   └── training/train.py            # Standalone training script
├── database/                        # SQLite DB lives here
├── tests/test_api.py                # Full async test suite
├── requirements.txt
├── pyproject.toml
└── .env.example
```

---

## Quick Start

### 1. Clone & set up environment

```bash
git clone <repo-url>
cd malguard
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
source venv/bin/activate

pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env if needed (defaults work out of the box)
```

### 3. Train the ML model (first time)

```bash
python ml_models/training/train.py
```

Output:
```
MalGuard ML Classifier Training
================================
[1/5] Generating dataset… (5000 samples)
[2/5] Encoding labels…
[3/5] Scaling features…
[4/5] Training GradientBoostingClassifier…
[5/5] Evaluation on held-out test set:
              precision    recall  f1-score   support
       Adware       0.97      0.94      0.95       ...
       ...
✅ Training complete!
```

### 4. Start the API server

```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Open **http://localhost:8000/docs** for the interactive Swagger UI.

---

## API Reference

### `POST /api/analyze`

Upload any file for static analysis + ML classification.

```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "file=@suspicious_file.exe"
```

**Response** (truncated):
```json
{
  "analysis_id": "f3a2b1c0-...",
  "filename": "suspicious_file.exe",
  "hashes": { "sha256": "abc123...", "md5": "...", "sha1": "..." },
  "entropy": 7.82,
  "high_entropy": true,
  "is_pe": true,
  "packer_detected": true,
  "suspicious_import_categories": {
    "Process Injection": ["VirtualAllocEx", "CreateRemoteThread"],
    "Ransomware Indicators": ["CryptEncrypt", "CryptGenKey"]
  },
  "threat_indicators": [
    "High file entropy – possible packing or encryption",
    "Known packer section name detected",
    "Suspicious API imports [Ransomware Indicators]: CryptEncrypt, CryptGenKey"
  ],
  "ml_prediction": "Ransomware",
  "ml_confidence": 0.89,
  "shap_explanation": [
    {
      "feature": "has_ransomware_apis",
      "raw_value": 1.0,
      "shap_impact": 0.42,
      "direction": "increases_risk",
      "mitre": {
        "tactic": "Impact",
        "technique": "T1486 – Data Encrypted for Impact"
      }
    }
  ],
  "mitre_tactics": ["Impact", "Defense Evasion"],
  "verdict": "MALICIOUS"
}
```

---

### `POST /api/diagnose`

Describe symptoms in plain English; get a matched malware family + full CIRP playbook.

```bash
curl -X POST http://localhost:8000/api/diagnose \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "Files renamed with .locked extension, ransom note on desktop"}'
```

**Response** (truncated):
```json
{
  "session_id": "...",
  "results": [{
    "family": "Ransomware",
    "confidence": 0.73,
    "playbook": [
      { "phase": "Contain",    "title": "Isolate the infected host immediately", ... },
      { "phase": "Eradicate",  "title": "Identify and remove the ransomware binary", ... },
      { "phase": "Recover",    "title": "Restore from clean backups", ... },
      { "phase": "Prevent",    "title": "Harden against future ransomware", ... }
    ]
  }]
}
```

---

### `GET /api/families`

List all malware families in the knowledge base.

### `GET /api/families/{family_name}`

Full entry for a specific family (Ransomware, Trojan, Worm, Spyware, Adware).

### `GET /api/reports`

List recent analysis reports.

### `GET /api/reports/{analysis_id}`

Retrieve a specific report by its UUID.

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `analysis_reports` | Every file analysed – hashes, entropy, ML result, verdict |
| `malware_families` | Knowledge-base entries with symptoms, IOCs, MITRE tactics |
| `playbooks` | Step-by-step CIRP playbooks linked to families |
| `diagnosis_sessions` | Audit trail of symptom-checker interactions |

---

## ML Pipeline

```
Static Analysis Output
       │
       ▼
Feature Engineering (14 features)
  file_size_kb, entropy, has_high_entropy, is_pe, packer_detected,
  num_imports, num_sections, has_process_injection, has_persistence,
  has_credential_access, has_ransomware_apis, has_network_c2,
  has_evasion, has_discovery
       │
       ▼
StandardScaler → GradientBoostingClassifier
       │
       ▼
SHAP TreeExplainer → Per-feature impact scores
       │
       ▼
MITRE ATT&CK Mapping → Tactic/Technique labels
```

**Families classified:** Clean · Ransomware · Trojan · Worm · Spyware · Adware

---

## Running Tests

```bash
pytest tests/ -v
```

---

## Safety & Security Notes

- Files are **never executed** — analysis is purely static (read-only byte inspection)
- Files are read into memory and **never written to disk** during analysis
- MIME type allowlist enforced before any analysis begins
- Path traversal attacks blocked in filename sanitisation
- Maximum upload size enforced at the byte-read level
- All reports stored with UUID public IDs (no sequential integer exposure)

---

## Extending with Real Training Data

Replace the synthetic dataset in `ml_models/training/train.py` with:

```python
import pandas as pd
df = pd.read_csv("ember_features.csv")  # EMBER 2018 dataset
X = df[FEATURE_NAMES].values
y_raw = df["label"].values
```

Recommended public datasets:
- **EMBER 2018** – 1M PE features from VirusTotal
- **VirusShare** – ~50M malware samples (requires registration)
- **MalwareBazaar** – Active malware repository by Abuse.ch
