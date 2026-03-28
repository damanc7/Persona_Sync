from contextlib import asynccontextmanager
from typing import Any
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

import database
from models import ProfileUpdateRequest, HealthResponse, SectionEnum
from mcp_server import mcp
from stubs_router import router as stubs_router

# Call once at module level — this creates and stores mcp._session_manager
_mcp_asgi_app = mcp.streamable_http_app()


@asynccontextmanager
async def lifespan(app: FastAPI):
    database.init_db()
    database.seed_schema()
    # Manually run the MCP session manager (Starlette mount doesn't trigger sub-app lifespan)
    async with mcp.session_manager.run():
        yield


app = FastAPI(
    title="PersonaSync MCP Server",
    description="Personal data sovereignty — REST + MCP interface",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(stubs_router)

# ── REST endpoints ──────────────────────────────────────────────────────────

@app.get("/health", response_model=HealthResponse, tags=["system"])
def health():
    return {"status": "ok"}


@app.get("/schema", tags=["profile"])
def get_schema():
    """Returns all defined profile fields organised by section."""
    return database.get_schema()


@app.get("/profile", tags=["profile"])
def get_profile():
    """Returns the full approved user profile."""
    return database.get_profile()


@app.get("/profile/{section}", tags=["profile"])
def get_profile_section(section: SectionEnum):
    """Returns profile data for a single section."""
    result = database.get_profile(section=section.value)
    if result is None:
        raise HTTPException(status_code=404, detail="Section not found")
    return result


@app.put("/profile", tags=["profile"])
def update_profile(request: ProfileUpdateRequest):
    """Upserts one or more profile fields."""
    for field in request.fields:
        database.upsert_field(
            section=field.section.value,
            field_key=field.key,
            field_value=field.value,
            data_type=field.data_type or "text",
            source=field.source or "user",
        )
    return {"updated": len(request.fields)}


# ── /api/* adapter routes (for the React frontend) ─────────────────────────

_SECTION_TITLES = {
    "identity":     "Identity",
    "professional": "Professional",
    "preferences":  "Preferences",
    "goals":        "Goals",
    "context":      "Context",
}

_TYPE_MAP = {"text": "text", "date": "date", "number": "text"}


@app.get("/api/health", tags=["frontend"])
def api_health():
    return {"status": "ok"}


@app.get("/api/schema", tags=["frontend"])
def api_schema():
    """Schema in the shape the React UI expects: ProfileSection[]."""
    raw = database.get_schema()
    return [
        {
            "id": section,
            "title": _SECTION_TITLES.get(section, section.title()),
            "fields": [
                {
                    "id": f["field_key"],
                    "type": _TYPE_MAP.get(f["data_type"], "text"),
                    "label": f["label"],
                    "value": None,
                    "required": bool(f["required"]),
                }
                for f in fields
            ],
        }
        for section, fields in raw.items()
    ]


@app.get("/api/profile", tags=["frontend"])
def api_profile():
    """Flat key→value profile the React UI expects."""
    raw = database.get_profile()
    flat: dict[str, Any] = {}
    for section_data in raw.values():
        flat.update(section_data)
    return flat


@app.post("/api/profile", tags=["frontend"])
def api_save_profile(data: dict[str, Any] = Body(...)):
    """Accept flat key→value, map back to sections via schema, upsert."""
    schema = database.get_schema()
    field_to_section: dict[str, str] = {
        f["field_key"]: section
        for section, fields in schema.items()
        for f in fields
    }
    for key, value in data.items():
        section = field_to_section.get(key)
        if section and value is not None:
            database.upsert_field(section, key, str(value))
    return {"success": True}


# Mount MCP sub-app AFTER all REST routes at root so it receives /mcp intact
app.mount("/", _mcp_asgi_app)
