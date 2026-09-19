"""
/api/diagnose – Symptom-Based Malware Diagnosis Endpoint
=========================================================
Accepts a free-text description of observed symptoms and returns:
  * Most likely malware family / families (ranked by TF-IDF cosine similarity)
  * Full CIRP playbook (Contain → Eradicate → Recover → Prevent)
  * Relevant MITRE ATT&CK tactics
  * Indicators of Compromise (IOCs) to look for
"""

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from backend.core.database import get_db, DiagnosisSession
from backend.services.knowledge_base import symptom_matcher, get_family_info, KNOWLEDGE_BASE
from backend.schemas.schemas import (
    DiagnoseRequest,
    DiagnoseResponse,
    DiagnoseResult,
    PlaybookStep,
    FamilyInfo,
)

router = APIRouter(prefix="/api", tags=["Diagnosis & Knowledge Base"])


@router.post(
    "/diagnose",
    response_model=DiagnoseResponse,
    summary="Diagnose malware family from symptom description",
    description=(
        "Provide a free-text description of observed anomalies or symptoms. "
        "The engine uses TF-IDF cosine similarity to match against the knowledge base "
        "and returns remediation playbooks ranked by confidence."
    ),
)
async def diagnose(
    request: DiagnoseRequest,
    db: AsyncSession = Depends(get_db),
) -> DiagnoseResponse:
    # ── Match symptoms ────────────────────────────────────────────────────
    matches = symptom_matcher.match(request.symptoms, top_k=request.top_k)

    if not matches:
        raise HTTPException(
            status_code=422,
            detail="Could not match symptoms to any known malware family. "
                   "Please provide more specific symptom descriptions.",
        )

    # ── Build result objects ──────────────────────────────────────────────
    results = []
    for match in matches:
        playbook_steps = [
            PlaybookStep(
                phase=step["phase"],
                step_order=step["step_order"],
                title=step["title"],
                description=step["description"],
            )
            for step in sorted(match["playbook"], key=lambda x: x["step_order"])
        ]
        results.append(
            DiagnoseResult(
                family=match["family"],
                confidence=match["confidence"],
                description=match["description"],
                mitre_tactics=match["mitre_tactics"],
                iocs=match["iocs"],
                playbook=playbook_steps,
            )
        )

    # ── Persist session ───────────────────────────────────────────────────
    session_id = str(uuid.uuid4())
    session = DiagnosisSession(
        public_id=session_id,
        symptom_text=request.symptoms,
        matched_family=results[0].family if results else None,
        confidence_score=results[0].confidence if results else None,
        playbook_phases_returned=list({s.phase for r in results for s in r.playbook}),
    )
    db.add(session)
    await db.commit()

    return DiagnoseResponse(
        session_id=session_id,
        symptom_text=request.symptoms,
        results=results,
        created_at=datetime.now(timezone.utc),
    )


@router.get(
    "/families",
    summary="List all malware families in the knowledge base",
)
async def list_families():
    return {
        "total": len(KNOWLEDGE_BASE),
        "families": [
            {
                "name": entry["family"],
                "description": entry["description"],
                "mitre_tactics": entry.get("mitre_tactics", []),
            }
            for entry in KNOWLEDGE_BASE
        ],
    }


@router.get(
    "/families/{family_name}",
    response_model=FamilyInfo,
    summary="Get full knowledge-base entry for a specific malware family",
)
async def get_family(family_name: str):
    entry = get_family_info(family_name)
    if not entry:
        raise HTTPException(
            status_code=404,
            detail=f"Malware family '{family_name}' not found in knowledge base. "
                   f"Available families: {[e['family'] for e in KNOWLEDGE_BASE]}",
        )
    playbook_steps = [
        PlaybookStep(
            phase=step["phase"],
            step_order=step["step_order"],
            title=step["title"],
            description=step["description"],
        )
        for step in sorted(entry.get("playbooks", []), key=lambda x: x["step_order"])
    ]
    return FamilyInfo(
        family=entry["family"],
        description=entry["description"],
        mitre_tactics=entry.get("mitre_tactics", []),
        iocs=entry.get("iocs", []),
        symptoms=entry.get("symptoms", []),
        playbook=playbook_steps,
    )
