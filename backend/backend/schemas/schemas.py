"""
Pydantic request/response schemas for all MalGuard API endpoints.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# ── Shared ────────────────────────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None


# ── /api/analyze ──────────────────────────────────────────────────────────────

class HashInfo(BaseModel):
    sha256: str
    md5: str
    sha1: str


class PESectionInfo(BaseModel):
    name: str
    virtual_address: str
    raw_size: int
    virtual_size: int
    entropy: float
    characteristics: str
    suspicious_entropy: bool


class MitreEntry(BaseModel):
    tactic: str
    technique: str


class SHAPEntry(BaseModel):
    feature: str
    raw_value: float
    shap_impact: Optional[float] = None
    importance: Optional[float] = None
    direction: str
    mitre: Optional[MitreEntry] = None


class AnalysisResponse(BaseModel):
    analysis_id: str = Field(..., description="Unique public ID for this report")
    filename: str
    file_size: int
    hashes: HashInfo
    mime_type: str
    entropy: float
    high_entropy: bool
    is_pe: bool
    packer_detected: bool
    pe_info: Optional[Dict[str, Any]] = None
    imports: List[str] = []
    suspicious_import_categories: Dict[str, List[str]] = {}
    printable_strings: List[str] = []
    threat_indicators: List[str] = []
    preliminary_verdict: str

    # ML results
    ml_prediction: Optional[str] = None
    ml_confidence: Optional[float] = None
    ml_probabilities: Optional[Dict[str, float]] = None
    shap_explanation: Optional[List[SHAPEntry]] = None
    mitre_tactics: Optional[List[str]] = None

    # Final verdict
    verdict: str
    created_at: datetime


# ── /api/diagnose ─────────────────────────────────────────────────────────────

class DiagnoseRequest(BaseModel):
    symptoms: str = Field(
        ...,
        min_length=10,
        max_length=2000,
        description="Free-text description of observed symptoms or anomalies",
        examples=["Files have been renamed with .locked extension and there's a ransom note on my desktop"],
    )
    top_k: int = Field(
        default=1,
        ge=1,
        le=5,
        description="Number of malware families to return (ranked by confidence)",
    )


class PlaybookStep(BaseModel):
    phase: str
    step_order: int
    title: str
    description: str


class DiagnoseResult(BaseModel):
    family: str
    confidence: float
    description: str
    mitre_tactics: List[str]
    iocs: List[str]
    playbook: List[PlaybookStep]


class DiagnoseResponse(BaseModel):
    session_id: str
    symptom_text: str
    results: List[DiagnoseResult]
    created_at: datetime


# ── /api/reports ──────────────────────────────────────────────────────────────

class ReportSummary(BaseModel):
    analysis_id: str
    filename: str
    sha256: str
    verdict: str
    ml_prediction: Optional[str]
    ml_confidence: Optional[float]
    created_at: datetime


class ReportListResponse(BaseModel):
    total: int
    reports: List[ReportSummary]


# ── /api/families ─────────────────────────────────────────────────────────────

class FamilyInfo(BaseModel):
    family: str
    description: str
    mitre_tactics: List[str]
    iocs: List[str]
    symptoms: List[str]
    playbook: List[PlaybookStep]
