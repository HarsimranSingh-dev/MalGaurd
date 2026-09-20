"""
MalGuard FastAPI Application – Entry Point
==========================================
Wires together all routers, CORS, error handling, startup/shutdown lifecycle,
and serves the OpenAPI/Swagger docs at /docs.
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from backend.core.config import settings
from backend.core.database import init_db
from backend.api.routes import analyze, diagnose


# ── Lifespan (replaces on_event) ──────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: initialise DB and pre-load ML model."""
    print(f"[MalGuard] Starting up – {settings.APP_NAME} v{settings.APP_VERSION}")

    # Create SQLite tables
    await init_db()
    print("[MalGuard] Database tables initialised")

    # Pre-warm the ML model so first request isn't slow
    try:
        from backend.services.ml_classifier import _load_models
        _load_models()
        print("[MalGuard] ML model loaded")
    except Exception as exc:
        print(f"[MalGuard] ML model pre-warm failed (will retry on first request): {exc}")

    # Ensure temp upload dir exists
    settings.TEMP_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

    yield  # ── Application running ──

    print("[MalGuard] Shutting down")


# ── Application factory ───────────────────────────────────────────────────────

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "**MalGuard** – Malware Analysis & Response Platform\n\n"
        "Endpoints:\n"
        "- `POST /api/analyze` – Upload a file for static analysis + ML classification\n"
        "- `POST /api/diagnose` – Describe symptoms to get a remediation playbook\n"
        "- `GET  /api/families` – List all malware families in the knowledge base\n"
        "- `GET  /api/reports`  – List recent analysis reports\n"
    ),
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global exception handlers ─────────────────────────────────────────────────

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred.", "type": type(exc).__name__},
    )

# ── Routers ───────────────────────────────────────────────────────────────────

app.include_router(analyze.router)
app.include_router(diagnose.router)

# ── Health check ──────────────────────────────────────────────────────────────

@app.get("/health", tags=["Meta"])
async def health():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/", tags=["Meta"])
async def root():
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "docs": "/docs",
        "health": "/health",
    }
