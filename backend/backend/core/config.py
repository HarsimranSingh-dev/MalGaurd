"""
MalGuard Backend - Application Configuration
Centralises all runtime settings with sensible defaults and env-var overrides.
"""
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from pathlib import Path
from typing import List


class Settings(BaseSettings):
    # ── Application ──────────────────────────────────────────────────────────
    APP_NAME: str = "MalGuard"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # ── Upload Safety ─────────────────────────────────────────────────────────
    MAX_UPLOAD_SIZE_MB: int = 50          # hard cap in megabytes
    TEMP_UPLOAD_DIR: Path = Path("temp_uploads")

    # Allowed MIME types for static analysis (no executables in text form)
    ALLOWED_MIME_PREFIXES: List[str] = [
        "application/x-dosexec",          # PE (EXE/DLL)
        "application/x-executable",
        "application/octet-stream",
        "application/x-msdownload",
        "application/vnd.microsoft.portable-executable",
        "application/x-msdos-program",
        "text/plain",                      # scripts
        "application/zip",                 # archives
        "application/x-rar-compressed",
        "application/x-7z-compressed",
    ]

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str = "sqlite+aiosqlite:///./database/malguard.db"

    # ── ML ────────────────────────────────────────────────────────────────────
    ML_MODEL_PATH: Path = Path("ml_models/artifacts/classifier.joblib")
    SCALER_PATH: Path = Path("ml_models/artifacts/scaler.joblib")
    LABEL_ENCODER_PATH: Path = Path("ml_models/artifacts/label_encoder.joblib")

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()
