"""
ML Classifier + SHAP Explainability – MalGuard Module 3
========================================================

Architecture
------------
* GradientBoostingClassifier (scikit-learn) trained on engineered features
  derived from static analysis output.
* A mock training routine seeds a realistic model that can be replaced
  by training on a real dataset (EMBER, VirusShare, etc.).
* SHAP TreeExplainer provides per-sample feature attribution.
* Each explanation maps back to a MITRE ATT&CK tactic.

Feature vector (14 features)
-----------------------------
 0  file_size_kb
 1  entropy
 2  has_high_entropy         (0/1)
 3  is_pe                    (0/1)
 4  packer_detected          (0/1)
 5  num_imports
 6  num_sections
 7  has_process_injection    (0/1)
 8  has_persistence          (0/1)
 9  has_credential_access    (0/1)
10  has_ransomware_apis      (0/1)
11  has_network_c2           (0/1)
12  has_evasion              (0/1)
13  has_discovery            (0/1)
"""

import os
import warnings
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import joblib
import numpy as np

from backend.core.config import settings

warnings.filterwarnings("ignore")

# ── MITRE ATT&CK mapping ─────────────────────────────────────────────────────

FEATURE_NAMES: List[str] = [
    "file_size_kb",
    "entropy",
    "has_high_entropy",
    "is_pe",
    "packer_detected",
    "num_imports",
    "num_sections",
    "has_process_injection",
    "has_persistence",
    "has_credential_access",
    "has_ransomware_apis",
    "has_network_c2",
    "has_evasion",
    "has_discovery",
]

FEATURE_MITRE_MAP: Dict[str, Dict[str, str]] = {
    "has_high_entropy": {
        "tactic": "Defense Evasion",
        "technique": "T1027 – Obfuscated Files or Information",
    },
    "packer_detected": {
        "tactic": "Defense Evasion",
        "technique": "T1027.002 – Software Packing",
    },
    "has_process_injection": {
        "tactic": "Defense Evasion / Privilege Escalation",
        "technique": "T1055 – Process Injection",
    },
    "has_persistence": {
        "tactic": "Persistence",
        "technique": "T1547.001 – Registry Run Keys / Startup Folder",
    },
    "has_credential_access": {
        "tactic": "Credential Access",
        "technique": "T1003 – OS Credential Dumping",
    },
    "has_ransomware_apis": {
        "tactic": "Impact",
        "technique": "T1486 – Data Encrypted for Impact",
    },
    "has_network_c2": {
        "tactic": "Command and Control",
        "technique": "T1071 – Application Layer Protocol",
    },
    "has_evasion": {
        "tactic": "Defense Evasion",
        "technique": "T1497 – Virtualization/Sandbox Evasion",
    },
    "has_discovery": {
        "tactic": "Discovery",
        "technique": "T1082 – System Information Discovery",
    },
    "entropy": {
        "tactic": "Defense Evasion",
        "technique": "T1027 – Obfuscated Files or Information",
    },
}

MALWARE_FAMILIES = ["Clean", "Ransomware", "Trojan", "Worm", "Spyware", "Adware"]


# ── Feature engineering ──────────────────────────────────────────────────────

def build_feature_vector(static_result: Dict[str, Any]) -> np.ndarray:
    """
    Convert the static-analysis dict into a numeric feature vector.

    Parameters
    ----------
    static_result : dict – output of ``static_analysis.analyse_file``

    Returns
    -------
    np.ndarray of shape (1, 14)
    """
    cats = static_result.get("suspicious_import_categories", {})

    vec = [
        static_result.get("file_size", 0) / 1024,          # KB
        static_result.get("entropy", 0.0),
        float(static_result.get("high_entropy", False)),
        float(static_result.get("is_pe", False)),
        float(static_result.get("packer_detected", False)),
        float(len(static_result.get("imports", []))),
        float(len(static_result.get("pe_info", {}).get("sections", []))),
        float(bool(cats.get("Process Injection"))),
        float(bool(cats.get("Persistence"))),
        float(bool(cats.get("Credential Access"))),
        float(bool(cats.get("Ransomware Indicators"))),
        float(bool(cats.get("Network/C2"))),
        float(bool(cats.get("Evasion"))),
        float(bool(cats.get("Discovery"))),
    ]
    return np.array(vec, dtype=np.float32).reshape(1, -1)


# ── Mock training ─────────────────────────────────────────────────────────────

def _train_and_save_mock_model() -> None:
    """
    Train a GradientBoostingClassifier on synthetic data and persist it.
    Replace this with real training once a labelled dataset is available.
    """
    from sklearn.ensemble import GradientBoostingClassifier
    from sklearn.preprocessing import StandardScaler, LabelEncoder
    from sklearn.pipeline import Pipeline

    rng = np.random.default_rng(42)
    n_samples = 2000
    n_features = len(FEATURE_NAMES)

    # Synthetic feature matrix
    X = rng.random((n_samples, n_features)).astype(np.float32)
    # Scale some features realistically
    X[:, 0] *= 2048        # file_size_kb
    X[:, 1] *= 8           # entropy 0-8
    X[:, 5] *= 200         # num_imports
    X[:, 6] = rng.integers(1, 12, size=n_samples)  # sections

    # Labels (deterministic rules so evaluation makes sense)
    y_raw = []
    for row in X:
        ent, hi, pi, pers, ca, rans, net, ev = (
            row[1], row[2], row[7], row[8],
            row[9], row[10], row[11], row[12]
        )
        if rans > 0.5 and hi > 0.5:
            y_raw.append("Ransomware")
        elif pi > 0.5 and (net > 0.5 or pers > 0.5):
            y_raw.append("Trojan")
        elif net > 0.5 and ev > 0.5:
            y_raw.append("Worm")
        elif ca > 0.5 and ent > 0.6:
            y_raw.append("Spyware")
        elif rng.random() > 0.85:
            y_raw.append("Adware")
        else:
            y_raw.append("Clean")

    le = LabelEncoder()
    y = le.fit_transform(y_raw)

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    clf = GradientBoostingClassifier(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.1,
        subsample=0.8,
        random_state=42,
    )
    clf.fit(X_scaled, y)

    # Persist
    Path(settings.ML_MODEL_PATH).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf, settings.ML_MODEL_PATH)
    joblib.dump(scaler, settings.SCALER_PATH)
    joblib.dump(le, settings.LABEL_ENCODER_PATH)
    print("[ML] Mock model trained and saved.")


# ── Model loader (singleton) ──────────────────────────────────────────────────

_classifier = None
_scaler = None
_label_encoder = None


def _load_models():
    global _classifier, _scaler, _label_encoder
    if _classifier is not None:
        return

    if not Path(settings.ML_MODEL_PATH).exists():
        print("[ML] No saved model found – training mock model …")
        _train_and_save_mock_model()

    _classifier = joblib.load(settings.ML_MODEL_PATH)
    _scaler = joblib.load(settings.SCALER_PATH)
    _label_encoder = joblib.load(settings.LABEL_ENCODER_PATH)


# ── Inference ─────────────────────────────────────────────────────────────────

def classify(static_result: Dict[str, Any]) -> Dict[str, Any]:
    """
    Classify a file and return prediction + SHAP-based explanation.

    Parameters
    ----------
    static_result : dict – output of static_analysis.analyse_file

    Returns
    -------
    dict with keys:
        prediction, confidence, probabilities,
        shap_explanation, mitre_tactics
    """
    _load_models()

    X_raw = build_feature_vector(static_result)
    X_scaled = _scaler.transform(X_raw)

    # ── Prediction ────────────────────────────────────────────────────────
    pred_idx = _classifier.predict(X_scaled)[0]
    proba = _classifier.predict_proba(X_scaled)[0]
    confidence = float(proba[pred_idx])
    prediction = _label_encoder.inverse_transform([pred_idx])[0]
    probabilities = {
        cls: round(float(p), 4)
        for cls, p in zip(_label_encoder.classes_, proba)
    }

    # ── SHAP explanation ──────────────────────────────────────────────────
    shap_explanation: List[Dict[str, Any]] = []
    mitre_tactics: List[str] = []

    try:
        import shap  # type: ignore
        explainer = shap.TreeExplainer(_classifier)
        shap_values = explainer.shap_values(X_scaled)

        # For multi-class GBC, shap_values is a list per class
        if isinstance(shap_values, list):
            sv = shap_values[pred_idx][0]
        else:
            sv = shap_values[0]

        # Sort by absolute impact descending
        indices = np.argsort(np.abs(sv))[::-1]
        for i in indices[:8]:  # top 8 features
            feat = FEATURE_NAMES[i]
            impact = float(sv[i])
            raw_val = float(X_raw[0, i])

            entry: Dict[str, Any] = {
                "feature": feat,
                "raw_value": round(raw_val, 4),
                "shap_impact": round(impact, 4),
                "direction": "increases_risk" if impact > 0 else "decreases_risk",
            }
            if feat in FEATURE_MITRE_MAP:
                entry["mitre"] = FEATURE_MITRE_MAP[feat]
                tactic = FEATURE_MITRE_MAP[feat]["tactic"]
                if tactic not in mitre_tactics:
                    mitre_tactics.append(tactic)

            shap_explanation.append(entry)

    except Exception as exc:
        # SHAP failed – fall back to feature-importance ranking
        print(f"[SHAP] Fallback to feature importance: {exc}")
        importances = _classifier.feature_importances_
        top_indices = np.argsort(importances)[::-1][:8]
        for i in top_indices:
            feat = FEATURE_NAMES[i]
            entry = {
                "feature": feat,
                "raw_value": round(float(X_raw[0, i]), 4),
                "importance": round(float(importances[i]), 4),
                "direction": "feature_importance_fallback",
            }
            if feat in FEATURE_MITRE_MAP:
                entry["mitre"] = FEATURE_MITRE_MAP[feat]
                tactic = FEATURE_MITRE_MAP[feat]["tactic"]
                if tactic not in mitre_tactics:
                    mitre_tactics.append(tactic)
            shap_explanation.append(entry)

    return {
        "prediction": prediction,
        "confidence": round(confidence, 4),
        "probabilities": probabilities,
        "shap_explanation": shap_explanation,
        "mitre_tactics": mitre_tactics,
    }
