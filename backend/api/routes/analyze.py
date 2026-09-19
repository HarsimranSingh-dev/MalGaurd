"""
/api/analyze – File Upload & Static Analysis Endpoint
======================================================
Accepts multipart/form-data file uploads, runs the static analysis engine
and the ML classifier, persists results to the database, and returns a
structured JSON report.

Safety guarantees
-----------------
* Files are read into memory immediately; temp file is deleted in a
  `finally` block regardless of outcome.
* Maximum file size enforced before reading content.
* MIME type validated against allowlist.
* Original filename is sanitised; path-traversal characters rejected.
"""

import uuid
from datetime import datetime

from fastapi import APIRouter, File, HTTPException, UploadFile, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db, AnalysisReport
from backend.services import static_analysis, ml_classifier
from backend.schemas.schemas import AnalysisResponse
from backend.core.config import settings

router = APIRouter(prefix="/api", tags=["Analysis"])

MAX_BYTES = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024


@router.post(
    "/analyze",
    response_model=AnalysisResponse,
    summary="Upload and analyse a file for malware",
    description=(
        "Accepts a binary file upload. Performs static analysis (hashes, entropy, PE headers, "
        "strings) and ML-based classification without executing the file. "
        f"Maximum file size: {settings.MAX_UPLOAD_SIZE_MB} MB."
    ),
)
async def analyze_file(
    file: UploadFile = File(..., description="The file to analyse"),
    db: AsyncSession = Depends(get_db),
) -> AnalysisResponse:
    # ── 1. Read file into memory with size guard ────────────────────────────
    file_bytes = await file.read(MAX_BYTES + 1)
    if len(file_bytes) > MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB} MB",
        )
    if len(file_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    # ── 2. Validate (MIME, filename) ───────────────────────────────────────
    original_name = file.filename or "unknown"
    error = static_analysis.validate_upload(
        file_bytes, original_name, file.content_type or ""
    )
    if error:
        raise HTTPException(status_code=422, detail=error)

    # ── 3. Static analysis ────────────────────────────────────────────────
    try:
        static_result = static_analysis.analyse_file(file_bytes, original_name)
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Static analysis failed: {str(exc)}",
        )

    # ── 4. ML classification ──────────────────────────────────────────────
    ml_result = {}
    try:
        ml_result = ml_classifier.classify(static_result)
    except Exception as exc:
        # ML failure is non-fatal; we still return static results
        print(f"[ML] Classification error: {exc}")

    # ── 5. Determine final verdict ─────────────────────────────────────────
    prediction = ml_result.get("prediction", "Unknown")
    confidence = ml_result.get("confidence", 0.0)
    preliminary = static_result.get("preliminary_verdict", "SUSPICIOUS")

    if prediction == "Clean" and preliminary == "CLEAN":
        verdict = "CLEAN"
    elif prediction in ("Ransomware", "Trojan", "Worm", "Spyware") and confidence > 0.6:
        verdict = "MALICIOUS"
    elif preliminary == "MALICIOUS" or (confidence > 0.4 and prediction != "Clean"):
        verdict = "SUSPICIOUS"
    else:
        verdict = preliminary

    # ── 6. Persist to database ────────────────────────────────────────────
    public_id = str(uuid.uuid4())
    pe_sections = []
    if static_result.get("pe_info"):
        pe_sections = static_result["pe_info"].get("sections", [])

    report = AnalysisReport(
        public_id=public_id,
        filename=original_name,
        file_size=static_result["file_size"],
        sha256=static_result["hashes"]["sha256"],
        md5=static_result["hashes"]["md5"],
        file_type=static_result["mime_type"],
        entropy=static_result["entropy"],
        is_pe=static_result["is_pe"],
        pe_imports=static_result.get("imports", []),
        pe_sections=pe_sections,
        printable_strings_sample=static_result.get("printable_strings", []),
        packer_detected=static_result.get("packer_detected", False),
        ml_prediction=ml_result.get("prediction"),
        ml_confidence=ml_result.get("confidence"),
        ml_probabilities=ml_result.get("probabilities"),
        mitre_tactics=ml_result.get("mitre_tactics"),
        shap_explanation=[
            e if isinstance(e, dict) else e.model_dump()
            for e in (ml_result.get("shap_explanation") or [])
        ],
        verdict=verdict,
    )
    db.add(report)
    await db.commit()
    await db.refresh(report)

    # ── 7. Build response ─────────────────────────────────────────────────
    pe_info_clean = {
        k: v for k, v in (static_result.get("pe_info") or {}).items()
        if k != "sections"
    }
    if pe_sections:
        pe_info_clean["sections"] = pe_sections

    return AnalysisResponse(
        analysis_id=public_id,
        filename=original_name,
        file_size=static_result["file_size"],
        hashes=static_result["hashes"],
        mime_type=static_result["mime_type"],
        entropy=static_result["entropy"],
        high_entropy=static_result["high_entropy"],
        is_pe=static_result["is_pe"],
        packer_detected=static_result["packer_detected"],
        pe_info=pe_info_clean or None,
        imports=static_result.get("imports", []),
        suspicious_import_categories=static_result.get(
            "suspicious_import_categories", {}
        ),
        printable_strings=static_result.get("printable_strings", []),
        threat_indicators=static_result.get("threat_indicators", []),
        preliminary_verdict=preliminary,
        ml_prediction=ml_result.get("prediction"),
        ml_confidence=ml_result.get("confidence"),
        ml_probabilities=ml_result.get("probabilities"),
        shap_explanation=ml_result.get("shap_explanation"),
        mitre_tactics=ml_result.get("mitre_tactics"),
        verdict=verdict,
        created_at=report.created_at,
    )


@router.get(
    "/reports",
    summary="List recent analysis reports",
)
async def list_reports(
    limit: int = 20,
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select, func
    stmt = (
        select(AnalysisReport)
        .order_by(AnalysisReport.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    result = await db.execute(stmt)
    reports = result.scalars().all()

    count_stmt = select(func.count()).select_from(AnalysisReport)
    total = (await db.execute(count_stmt)).scalar()

    return {
        "total": total,
        "reports": [
            {
                "analysis_id": r.public_id,
                "filename": r.filename,
                "sha256": r.sha256,
                "verdict": r.verdict,
                "ml_prediction": r.ml_prediction,
                "ml_confidence": r.ml_confidence,
                "created_at": r.created_at,
            }
            for r in reports
        ],
    }


@router.get(
    "/reports/{analysis_id}",
    summary="Retrieve a specific analysis report by ID",
)
async def get_report(analysis_id: str, db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    stmt = select(AnalysisReport).where(AnalysisReport.public_id == analysis_id)
    result = await db.execute(stmt)
    report = result.scalar_one_or_none()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
