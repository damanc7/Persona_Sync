from mcp.server.fastmcp import FastMCP
from database import get_profile, search_profile, get_schema, upsert_field
from models import SectionEnum
import json

mcp = FastMCP("PersonaSync", stateless_http=True)


@mcp.tool()
def get_full_profile() -> dict:
    """Returns the complete user profile data across all sections."""
    return get_profile()


@mcp.tool()
def get_profile_section(section: str) -> dict:
    """
    Returns profile data for a specific section.
    Valid sections: identity, professional, preferences, goals, context
    """
    valid = {s.value for s in SectionEnum}
    if section not in valid:
        return {"error": f"Invalid section '{section}'. Valid: {sorted(valid)}"}
    return get_profile(section=section)


@mcp.tool()
def search_profile_data(query: str) -> list:
    """
    Search profile fields by key or value.
    Returns matching objects with section, field_key, field_value.
    """
    return search_profile(query)


@mcp.tool()
def update_profile(fields: list[dict]) -> dict:
    """
    Store or update one or more profile fields in the database.

    Each item in `fields` must have:
      - section   : one of identity | professional | preferences | goals | context
      - key       : the field key (e.g. "job_title", "skills")
      - value     : the value to store (string)
      - data_type : optional, defaults to "text"

    Example:
      fields = [
        {"section": "professional", "key": "skills", "value": "Python, FastAPI"},
        {"section": "goals", "key": "short_term", "value": "Launch DataDaddy MVP"}
      ]

    Returns a summary of what was written.
    """
    valid_sections = {s.value for s in SectionEnum}
    written = []
    errors = []

    for f in fields:
        section = f.get("section", "")
        key = f.get("key", "")
        value = f.get("value", "")
        data_type = f.get("data_type", "text")

        if section not in valid_sections:
            errors.append(f"Invalid section '{section}' for key '{key}'. Valid: {sorted(valid_sections)}")
            continue
        if not key:
            errors.append("Missing 'key' in field entry.")
            continue

        upsert_field(section=section, field_key=key, field_value=str(value),
                     data_type=data_type, source="agent")
        written.append(f"{section}.{key}")

    return {"written": written, "errors": errors}


@mcp.resource("profile://schema")
def profile_schema_resource() -> str:
    """The full profile schema in JSON — use this to discover available fields."""
    return json.dumps(get_schema(), indent=2)
