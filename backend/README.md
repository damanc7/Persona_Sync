# PersonaSync MCP Server

A self-hosted personal data server with REST and MCP interfaces. Store your profile once — let AI agents access it with structured, controlled queries.

## Stack

- **FastAPI** — REST API + MCP host
- **MCP Python SDK** — FastMCP with streamable HTTP transport
- **SQLite** — local persistent storage

## Setup

```bash
cd persona_sync_mcp
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

Server starts at `http://localhost:8000`

Interactive docs: `http://localhost:8000/docs`

---

## REST Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check → `{"status":"ok"}` |
| GET | `/schema` | All profile field definitions by section |
| GET | `/profile` | Full approved profile |
| GET | `/profile/{section}` | Single section (identity, professional, preferences, goals, context) |
| PUT | `/profile` | Upsert one or more profile fields |

### PUT /profile example

```json
{
  "fields": [
    { "section": "identity", "key": "full_name", "value": "Jane Doe" },
    { "section": "professional", "key": "job_title", "value": "Software Engineer" }
  ]
}
```

---

## MCP Interface

MCP endpoint: `http://localhost:8000/mcp`

### Tools

| Tool | Description |
|------|-------------|
| `get_full_profile` | Returns the complete profile across all sections |
| `get_profile_section` | Returns one section by name |
| `search_profile_data` | Searches fields by key or value |

### Resources

| URI | Description |
|-----|-------------|
| `profile://schema` | Full field schema in JSON |

---

## Connect Claude Code

Add to your MCP settings (`~/.claude/settings.json` or project `.claude/settings.json`):

```json
{
  "mcpServers": {
    "persona-sync": {
      "type": "http",
      "url": "http://localhost:8000/mcp"
    }
  }
}
```

---

## Profile Sections

| Section | Fields |
|---------|--------|
| `identity` | full_name, date_of_birth, city, country, languages |
| `professional` | job_title, company, industry, years_experience, skills, bio |
| `preferences` | interests, hobbies, communication_style, learning_style |
| `goals` | short_term, long_term, current_focus |
| `context` | timezone, availability, preferred_contact |

---

## Project Structure

```
persona_sync_mcp/
├── main.py          # FastAPI app + MCP mount
├── mcp_server.py    # FastMCP tools and resources
├── database.py      # SQLite init, CRUD, search
├── models.py        # Pydantic schemas
├── requirements.txt
└── persona_sync.db  # created on first run
```
