"""
MalGuard ML Model Training Script
==================================
Run this script directly to train and persist the ML classifier:
    python ml_models/training/train.py

For production: replace the synthetic data generation with a real
labelled dataset (EMBER 2018, VirusShare, MalwareDB, etc.)
"""

import sys
import os

# Allow running from the project root
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import numpy as np
from pathlib import Path
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib

from backend.core.config import settings
from backend.services.ml_classifier import FEATURE_NAMES, MALWARE_FAMILIES


def generate_synthetic_dataset(n_samples: int = 5000, seed: int = 42):
    """
    Generate a synthetic labelled dataset for demonstration.
    Each sample is a feature vector matching FEATURE_NAMES.

    In production: load a CSV/parquet with real features extracted
    from a labelled malware corpus.
    """
    rng = np.random.default_rng(seed)
    n_features = len(FEATURE_NAMES)

    X = rng.random((n_samples, n_features)).astype(np.float32)
    X[:, 0] *= 2048       # file_size_kb
    X[:, 1] *= 8          # entropy 0–8
    X[:, 5] *= 300        # num_imports
    X[:, 6] = rng.integers(1, 16, size=n_samples)  # num_sections

    labels = []
    for row in X:
        ent, hi, is_pe, pack, pi, pers, ca, rans, net, ev, disc = (
            row[1], row[2], row[3], row[4], row[7],
            row[8], row[9], row[10], row[11], row[12], row[13]
        )
        # Deterministic rules based on feature combinations
        if rans > 0.5 and hi > 0.5 and is_pe > 0.5:
            labels.append("Ransomware")
        elif pi > 0.5 and pers > 0.5 and is_pe > 0.5:
            labels.append("Trojan")
        elif net > 0.7 and disc > 0.5:
            labels.append("Worm")
        elif ca > 0.6 and ent > 5.0:
            labels.append("Spyware")
        elif rng.random() > 0.9 and is_pe < 0.3:
            labels.append("Adware")
        else:
            labels.append("Clean")

    return X, labels


def train():
    print("=" * 60)
    print("MalGuard ML Classifier Training")
    print("=" * 60)

    # 1. Dataset
    print("\n[1/5] Generating dataset…")
    X, y_raw = generate_synthetic_dataset(n_samples=5000)
    print(f"      Samples: {len(X)}")
    from collections import Counter
    dist = Counter(y_raw)
    for fam, count in sorted(dist.items()):
        print(f"      {fam:15s}: {count:5d} ({count/len(y_raw)*100:.1f}%)")

    # 2. Encode labels
    print("\n[2/5] Encoding labels…")
    le = LabelEncoder()
    y = le.fit_transform(y_raw)
    print(f"      Classes: {list(le.classes_)}")

    # 3. Scale features
    print("\n[3/5] Scaling features…")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    # 4. Train
    print("\n[4/5] Training GradientBoostingClassifier…")
    clf = GradientBoostingClassifier(
        n_estimators=300,
        max_depth=4,
        learning_rate=0.08,
        subsample=0.8,
        min_samples_leaf=5,
        random_state=42,
        verbose=0,
    )
    clf.fit(X_train_s, y_train)

    # 5. Evaluate
    print("\n[5/5] Evaluation on held-out test set:")
    y_pred = clf.predict(X_test_s)
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    # Feature importances
    print("\nTop feature importances:")
    fi = sorted(zip(FEATURE_NAMES, clf.feature_importances_),
                key=lambda x: x[1], reverse=True)
    for name, imp in fi[:10]:
        bar = "█" * int(imp * 50)
        print(f"  {name:30s} {imp:.4f} {bar}")

    # 6. Persist
    print("\nSaving model artifacts…")
    Path(settings.ML_MODEL_PATH).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(clf, settings.ML_MODEL_PATH)
    joblib.dump(scaler, settings.SCALER_PATH)
    joblib.dump(le, settings.LABEL_ENCODER_PATH)
    print(f"  Classifier  → {settings.ML_MODEL_PATH}")
    print(f"  Scaler      → {settings.SCALER_PATH}")
    print(f"  Label Enc.  → {settings.LABEL_ENCODER_PATH}")
    print("\n✅ Training complete!")


if __name__ == "__main__":
    train()
