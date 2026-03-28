# DataDaddy

**Your data. Your terms. Usable anywhere.**

DataDaddy is a personal data sovereignty platform — a local-first profile store that lets you own, edit, and share your data with AI agents on your terms. No cloud lock-in. No platform dependency. You hold the database.

---

## The Problem

Every app you use builds a profile of you — LinkedIn knows your career, Google knows your interests, Amazon knows what you buy. You have no copy, no control, and no way to take that data somewhere useful.

Meanwhile, every AI tool you talk to starts from zero — you re-explain yourself every single time.

---

## The Fix

DataDaddy gives you a single source of truth for who you are. You store it locally, you edit it freely, and you expose it to AI agents via the **Model Context Protocol (MCP)** — the open standard that lets Claude, ChatGPT, Cursor, and others read structured data from external sources.

**Define yourself once. Use it everywhere.**

---

## What You Can Do

- **Edit your profile** — identity, career, preferences, goals, context — in a clean UI
- **See what algorithms think of you** — the Reverse Algorithm page shows what each platform inferred about you, with confidence scores and trait breakdowns
- **Connect AI agents** — Claude, ChatGPT, Gemini, Cursor, Perplexity can all query your profile via MCP
- **Export your data** — share a structured persona snapshot in any format (OpenAI, Anthropic, Gemini, JSON, Markdown)
- **Know your rights** — built-in guides for submitting data deletion and access requests to every major platform
- **Control the marketplace** — decide who can see your data and on what terms

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    You (the user)                   │
│                                                     │
│   ┌──────────────┐        ┌──────────────────────┐  │
│   │  React UI    │◄──────►│  FastAPI Backend     │  │
│   │  (Vite/TS)   │  /api  │  + SQLite DB         │  │
│   └──────────────┘        └──────────┬───────────┘  │
│                                      │ MCP           │
│                            ┌─────────▼────────────┐  │
│                            │  MCP Server          │  │
│                            │  (FastMCP / stdio)   │  │
│                            └─────────┬────────────┘  │
└──────────────────────────────────────┼───────────────┘
                                       │
              ┌────────────────────────┼──────────────────┐
              ▼                        ▼                   ▼
         Claude Desktop           Cursor IDE          Any MCP Client
```

**The key architectural advantage:** your data never leaves your machine unless you choose to share it. AI agents query your local MCP server in real time through a controlled, typed interface — they never get a raw copy.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion |
| Backend | FastAPI, SQLite, Pydantic |
| AI Interface | MCP Python SDK (FastMCP), stdio + streamable HTTP |

---

## Quick Start

### 1. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --port 8000
```

API docs at `http://localhost:8000/docs`

### 2. Frontend

```bash
npm install
npm run dev
```

UI at `http://localhost:5173`

### 3. Connect Claude Desktop

Add to `%APPDATA%\Claude\claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "datadaddy": {
      "command": "python3",
      "args": ["path/to/backend/stdio_server.py"]
    }
  }
}
```

Restart Claude Desktop. It will have access to 4 MCP tools:

| Tool | What it does |
|------|-------------|
| `get_full_profile` | Read your entire profile |
| `get_profile_section` | Read one section (identity, professional, etc.) |
| `search_profile_data` | Search fields by keyword |
| `update_profile` | Write new data back to your local DB |

---

## Profile Schema

Your data is organised into five sections:

| Section | Fields |
|---------|--------|
| `identity` | name, date of birth, city, country, languages |
| `professional` | job title, company, industry, experience, skills, bio |
| `preferences` | interests, hobbies, communication style, learning style |
| `goals` | short-term, long-term, current focus |
| `context` | timezone, availability, preferred contact |

---

## Project Structure

```
data_daddy/
├── backend/
│   ├── main.py           # FastAPI app + REST routes
│   ├── mcp_server.py     # MCP tools (read + write)
│   ├── database.py       # SQLite — schema, seed, upsert
│   ├── models.py         # Pydantic types
│   ├── stubs_router.py   # Mock data for frontend dev
│   ├── stdio_server.py   # Claude Desktop entry point
│   └── requirements.txt
└── src/
    ├── pages/            # Dashboard, Profile, DataMap, ReverseAlgorithm,
    │                     # DataRights, Marketplace, AgentConnections
    ├── components/       # UI components by feature
    └── hooks/            # React Query data hooks
```

---

> Built for the era where your personal data is infrastructure — not a product someone else monetises.
