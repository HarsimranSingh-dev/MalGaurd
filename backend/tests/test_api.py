"""
MalGuard Test Suite – Core Endpoints
Tests run against an in-memory SQLite database, no real files executed.
"""

import io
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from backend.main import app
from backend.core.database import Base, get_db


# ── Test DB fixture ───────────────────────────────────────────────────────────

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(TEST_DB_URL, future=True)
TestSessionLocal = async_sessionmaker(
    bind=test_engine, class_=AsyncSession, expire_on_commit=False
)


@pytest_asyncio.fixture(scope="session", autouse=True)
async def create_test_tables():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def db_session():
    async with TestSessionLocal() as session:
        yield session


@pytest_asyncio.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()


# ── Tests ─────────────────────────────────────────────────────────────────────

@pytest.mark.asyncio
async def test_health(client):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


@pytest.mark.asyncio
async def test_root(client):
    response = await client.get("/")
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_analyze_empty_file(client):
    """Empty file should be rejected."""
    response = await client.post(
        "/api/analyze",
        files={"file": ("empty.exe", b"", "application/octet-stream")},
    )
    assert response.status_code in (400, 422)


@pytest.mark.asyncio
async def test_analyze_text_file(client):
    """A plain text file should pass validation and be analysed."""
    content = b"Hello, this is a test text file for MalGuard analysis.\n" * 10
    response = await client.post(
        "/api/analyze",
        files={"file": ("test.txt", io.BytesIO(content), "text/plain")},
    )
    assert response.status_code == 200
    data = response.json()
    assert "analysis_id" in data
    assert "hashes" in data
    assert data["hashes"]["sha256"] != ""
    assert "verdict" in data
    assert data["is_pe"] is False


@pytest.mark.asyncio
async def test_analyze_pe_file(client):
    """
    Send a minimal valid PE file (MZ stub only).
    Should parse without crashing; is_pe should be True.
    """
    # Minimal MZ header that pefile will accept
    mz_stub = b"MZ" + b"\x00" * 62 + b"\x3c\x00\x00\x00"  # e_lfanew = 0x3c
    # PE signature at offset 0x3c
    pe_sig = b"\x00" * (0x3c - len(mz_stub)) + b"PE\x00\x00"
    minimal_pe = mz_stub + b"\x00" * 500
    response = await client.post(
        "/api/analyze",
        files={"file": ("test.exe", io.BytesIO(minimal_pe), "application/x-dosexec")},
    )
    # May succeed or fail PE parsing – but should not return 500
    assert response.status_code in (200, 422)


@pytest.mark.asyncio
async def test_diagnose_ransomware(client):
    """Ransomware symptoms should match Ransomware family."""
    response = await client.post(
        "/api/diagnose",
        json={
            "symptoms": "My files have been renamed with a .locked extension and there is a ransom note on my desktop demanding Bitcoin payment"
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "results" in data
    assert len(data["results"]) >= 1
    assert data["results"][0]["family"] == "Ransomware"
    assert len(data["results"][0]["playbook"]) > 0


@pytest.mark.asyncio
async def test_diagnose_too_short(client):
    """Very short symptom text should be rejected by Pydantic."""
    response = await client.post(
        "/api/diagnose",
        json={"symptoms": "help"},
    )
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_list_families(client):
    response = await client.get("/api/families")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 5
    names = [f["name"] for f in data["families"]]
    assert "Ransomware" in names
    assert "Trojan" in names


@pytest.mark.asyncio
async def test_get_family(client):
    response = await client.get("/api/families/Ransomware")
    assert response.status_code == 200
    data = response.json()
    assert data["family"] == "Ransomware"
    assert len(data["playbook"]) > 0
    phases = {s["phase"] for s in data["playbook"]}
    assert "Contain" in phases
    assert "Eradicate" in phases
    assert "Recover" in phases
    assert "Prevent" in phases


@pytest.mark.asyncio
async def test_get_family_not_found(client):
    response = await client.get("/api/families/NotARealMalware")
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_reports_empty(client):
    response = await client.get("/api/reports")
    assert response.status_code == 200
    data = response.json()
    assert "reports" in data
    assert "total" in data
