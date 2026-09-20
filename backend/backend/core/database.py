"""
MalGuard Backend – SQLAlchemy ORM models + async engine bootstrap.
All tables use Integer PKs with UUID-based public identifiers for security.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime,
    JSON, ForeignKey, Boolean
)
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from backend.core.config import settings


# ── Engine & Session ─────────────────────────────────────────────────────────

engine = create_async_engine(
    str(settings.DATABASE_URL),
    echo=settings.DEBUG,
    future=True,
    connect_args={"check_same_thread": False},  # SQLite only
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncSession:
    """FastAPI dependency – yields a DB session and closes it afterwards."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db() -> None:
    """Create all tables on first run."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ── Base ─────────────────────────────────────────────────────────────────────

class Base(DeclarativeBase):
    pass


# ── Models ───────────────────────────────────────────────────────────────────

class AnalysisReport(Base):
    """Persisted record for every file analysed."""
    __tablename__ = "analysis_reports"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(36), unique=True, index=True,
                       default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    # File metadata
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False)          # bytes
    sha256 = Column(String(64), nullable=False, index=True)
    md5 = Column(String(32), nullable=False)
    file_type = Column(String(128))

    # Static analysis
    entropy = Column(Float)
    is_pe = Column(Boolean, default=False)
    pe_imports = Column(JSON)                            # list[str]
    pe_sections = Column(JSON)                           # list[dict]
    printable_strings_sample = Column(JSON)              # list[str] (top 50)
    packer_detected = Column(Boolean, default=False)

    # ML classification
    ml_prediction = Column(String(64))                  # family label
    ml_confidence = Column(Float)
    ml_probabilities = Column(JSON)                      # {family: prob}
    mitre_tactics = Column(JSON)                         # list[str]
    shap_explanation = Column(JSON)                      # list[{feature, value, impact}]

    # Verdict
    verdict = Column(String(32))                         # CLEAN / SUSPICIOUS / MALICIOUS


class MalwareFamily(Base):
    """Knowledge-base entry for a malware family."""
    __tablename__ = "malware_families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(64), unique=True, nullable=False)
    description = Column(Text, nullable=False)
    mitre_tactics = Column(JSON)                         # list[str]
    iocs = Column(JSON)                                  # list[str]  (Indicators of Compromise)
    symptoms = Column(JSON)                              # list[str]  (plain-text warning signs)

    playbooks = relationship("Playbook", back_populates="family",
                             cascade="all, delete-orphan")


class Playbook(Base):
    """Step-by-step remediation playbook linked to a malware family."""
    __tablename__ = "playbooks"

    id = Column(Integer, primary_key=True, index=True)
    family_id = Column(Integer, ForeignKey("malware_families.id"), nullable=False)
    phase = Column(String(32), nullable=False)           # Contain / Eradicate / Recover / Prevent
    step_order = Column(Integer, nullable=False)
    title = Column(String(256), nullable=False)
    description = Column(Text, nullable=False)
    automated = Column(Boolean, default=False)           # True if an API can trigger it

    family = relationship("MalwareFamily", back_populates="playbooks")


class DiagnosisSession(Base):
    """Stores symptom-checker interactions for audit trails."""
    __tablename__ = "diagnosis_sessions"

    id = Column(Integer, primary_key=True, index=True)
    public_id = Column(String(36), unique=True, index=True,
                       default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    symptom_text = Column(Text, nullable=False)
    matched_family = Column(String(64))
    confidence_score = Column(Float)
    playbook_phases_returned = Column(JSON)              # list[str]
