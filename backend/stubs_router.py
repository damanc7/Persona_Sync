"""
Stub API routes that mirror the MSW mock handlers from the React frontend.
These feed every page of the UI with realistic data via the Vite proxy.
"""
from typing import Any, Optional
from fastapi import APIRouter, HTTPException, Query, Body
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["frontend-stubs"])

# ── Agent Connections state ───────────────────────────────────────────────────

_agent_connections: list[dict] = [
    {"id": "claude",     "name": "Claude",      "provider": "Anthropic",     "connected": True,  "lastConnected": "2026-03-28T12:30:00Z", "toolsUsed": 3, "color": "amber",   "description": "AI assistant with native MCP support via Claude Desktop and Claude Code."},
    {"id": "cursor",     "name": "Cursor",       "provider": "Cursor Inc",    "connected": True,  "lastConnected": "2026-03-28T12:20:00Z", "toolsUsed": 1, "color": "violet",  "description": "AI code editor with built-in MCP client support via .cursor/mcp.json."},
    {"id": "perplexity", "name": "Perplexity",   "provider": "Perplexity AI", "connected": False,                                                          "color": "cyan",    "description": "AI search engine with MCP tool-use support in the desktop app."},
    {"id": "chatgpt",    "name": "ChatGPT",      "provider": "OpenAI",        "connected": False,                                                          "color": "emerald", "description": "OpenAI assistant — MCP connector support rolling out via custom connectors."},
    {"id": "gemini",     "name": "Gemini",        "provider": "Google",        "connected": False,                                                          "color": "blue",    "description": "Google's AI assistant — MCP support in preview via Gemini for Workspace."},
]

MCP_SERVER_URL = "http://localhost:8000/mcp"

# ── In-memory state ──────────────────────────────────────────────────────────

_integrations: list[dict] = [
    {"id": "google",   "name": "Google",     "icon": "google",   "connected": True,  "lastScan": "2024-03-27T10:00:00Z", "itemCount": 42},
    {"id": "linkedin", "name": "LinkedIn",   "icon": "linkedin", "connected": True,  "lastScan": "2024-03-26T14:30:00Z", "itemCount": 18},
    {"id": "twitter",  "name": "Twitter / X","icon": "twitter",  "connected": False},
    {"id": "facebook", "name": "Facebook",   "icon": "facebook", "connected": True,  "lastScan": "2024-03-25T09:15:00Z", "itemCount": 67},
    {"id": "amazon",   "name": "Amazon",     "icon": "amazon",   "connected": False},
    {"id": "spotify",  "name": "Spotify",    "icon": "spotify",  "connected": True,  "lastScan": "2024-03-27T08:00:00Z", "itemCount": 12},
]

_scraped_items: list[dict] = [
    {"id": "s1",  "source": "Google",   "field": "Email",                 "value": "alex.rivera@gmail.com",              "confidence": 0.99, "status": "approved", "scrapedAt": "2024-03-27T10:00:00Z"},
    {"id": "s2",  "source": "Google",   "field": "Phone",                 "value": "+1 (555) 234-5678",                  "confidence": 0.87, "status": "approved", "scrapedAt": "2024-03-27T10:01:00Z"},
    {"id": "s3",  "source": "Google",   "field": "Location",              "value": "Dubai, UAE",                          "confidence": 0.92, "status": "approved", "scrapedAt": "2024-03-27T10:02:00Z"},
    {"id": "s4",  "source": "LinkedIn", "field": "Job Title",             "value": "Senior Full-Stack Engineer",          "confidence": 0.98, "status": "approved", "scrapedAt": "2024-03-26T14:30:00Z"},
    {"id": "s5",  "source": "LinkedIn", "field": "Company",               "value": "Hyperion Labs",                       "confidence": 0.98, "status": "approved", "scrapedAt": "2024-03-26T14:31:00Z"},
    {"id": "s6",  "source": "LinkedIn", "field": "Skills",                "value": "Python, TypeScript, FastAPI, LLMs",   "confidence": 0.95, "status": "pending",  "scrapedAt": "2024-03-26T14:32:00Z"},
    {"id": "s7",  "source": "Facebook", "field": "Date of Birth",         "value": "1993-07-14",                          "confidence": 0.89, "status": "pending",  "scrapedAt": "2024-03-25T09:15:00Z"},
    {"id": "s8",  "source": "Facebook", "field": "Relationship Status",   "value": "Single",                              "confidence": 0.72, "status": "denied",   "scrapedAt": "2024-03-25T09:16:00Z"},
    {"id": "s9",  "source": "Facebook", "field": "Hometown",              "value": "Karachi, Pakistan",                   "confidence": 0.81, "status": "pending",  "scrapedAt": "2024-03-25T09:17:00Z"},
    {"id": "s10", "source": "Spotify",  "field": "Music Preferences",     "value": "Electronic, Hip-Hop, Indie",          "confidence": 0.94, "status": "pending",  "scrapedAt": "2024-03-27T08:00:00Z"},
    {"id": "s11", "source": "Google",   "field": "Search History Summary","value": "AI, Distributed Systems, Travel",     "confidence": 0.76, "status": "denied",   "scrapedAt": "2024-03-27T10:03:00Z"},
    {"id": "s12", "source": "LinkedIn", "field": "Education",             "value": "BS Computer Science, FAST-NUCES",     "confidence": 0.97, "status": "approved", "scrapedAt": "2024-03-26T14:33:00Z"},
]

_collaborators: list[dict] = [
    {"id": "u1", "name": "Alex Rivera",  "email": "alex.rivera@hyperionlabs.io", "role": "owner",  "status": "active"},
    {"id": "u2", "name": "Jordan Lee",   "email": "jordan.lee@example.com",      "role": "editor", "status": "active"},
    {"id": "u3", "name": "Sam Rivera",   "email": "sam.rivera@example.com",      "role": "viewer", "status": "invited"},
    {"id": "u4", "name": "Taylor Kim",   "email": "taylor.kim@example.com",      "role": "editor", "status": "active"},
]

_messages: list[dict] = [
    {"id": "m1", "authorId": "u1",  "authorType": "user",         "content": "I reviewed the scraped data from LinkedIn. Some entries look off.",                                                                                         "timestamp": "2024-03-27T09:00:00Z", "topic": "scraped-data"},
    {"id": "m2", "authorId": "u2",  "authorType": "collaborator", "content": "Agreed. The skills section seems to have pulled in data from a different profile.",                                                                          "timestamp": "2024-03-27T09:05:00Z", "topic": "scraped-data"},
    {"id": "m3", "authorId": "llm", "authorType": "llm",          "content": "Based on the data patterns, the LinkedIn scrape may have captured connections' data. I recommend reviewing items s6 and s12 manually.",                     "timestamp": "2024-03-27T09:06:00Z", "topic": "scraped-data"},
    {"id": "m4", "authorId": "u4",  "authorType": "collaborator", "content": "Should we deny those items until we can verify?",                                                                                                           "timestamp": "2024-03-27T09:10:00Z", "topic": "scraped-data"},
    {"id": "m5", "authorId": "u1",  "authorType": "user",         "content": "Yes, let's be conservative. Better to deny and re-approve than approve incorrect data.",                                                                    "timestamp": "2024-03-27T09:12:00Z", "topic": "scraped-data"},
    {"id": "m6", "authorId": "u2",  "authorType": "collaborator", "content": "Also, the data map shows Acxiom has high exposure. Should we look into opt-outs?",                                                                         "timestamp": "2024-03-27T10:00:00Z", "topic": "data-map"},
    {"id": "m7", "authorId": "llm", "authorType": "llm",          "content": "Acxiom offers an opt-out at optout.acxiom.com. Given the 0.91 exposure score, this is recommended. Would you like me to draft an opt-out request?",        "timestamp": "2024-03-27T10:01:00Z", "topic": "data-map"},
]

_listings: list[dict] = [
    {"id": "l1", "title": "Professional Profile Bundle",   "category": "Professional", "price": 150, "bids": 4, "topBid": 175, "endsAt": "2026-04-05T00:00:00Z", "status": "active"},
    {"id": "l2", "title": "Consumer Preferences Dataset",  "category": "Consumer",     "price": 80,  "bids": 2, "topBid": 90,  "endsAt": "2026-04-03T00:00:00Z", "status": "active"},
    {"id": "l3", "title": "Location History Summary",      "category": "Location",     "price": 120, "bids": 6, "topBid": 145, "endsAt": "2026-04-10T00:00:00Z", "status": "active"},
    {"id": "l4", "title": "Media Consumption Patterns",    "category": "Media",        "price": 60,  "bids": 1,               "endsAt": "2026-04-02T00:00:00Z", "status": "active"},
    {"id": "l5", "title": "Social Graph Connections",      "category": "Social",       "price": 200, "bids": 8, "topBid": 240, "endsAt": "2026-03-20T00:00:00Z", "status": "sold"},
    {"id": "l6", "title": "Purchase History Q4 2025",      "category": "Commerce",     "price": 100, "bids": 3, "topBid": 110, "endsAt": "2026-03-15T00:00:00Z", "status": "expired"},
]

_bids: list[dict] = [
    {"id": "b1", "listingId": "l1", "amount": 160, "bidderAlias": "Researcher_7f3a",  "createdAt": "2026-03-26T10:00:00Z", "status": "pending"},
    {"id": "b2", "listingId": "l1", "amount": 175, "bidderAlias": "DataCo_alpha",     "createdAt": "2026-03-27T08:00:00Z", "status": "pending"},
    {"id": "b3", "listingId": "l1", "amount": 155, "bidderAlias": "AcademicLab_12",   "createdAt": "2026-03-25T14:00:00Z", "status": "rejected"},
    {"id": "b4", "listingId": "l2", "amount": 85,  "bidderAlias": "MarketFirm_9x",    "createdAt": "2026-03-26T11:00:00Z", "status": "pending"},
    {"id": "b5", "listingId": "l2", "amount": 90,  "bidderAlias": "InsightsCo_b2",    "createdAt": "2026-03-27T09:00:00Z", "status": "pending"},
    {"id": "b6", "listingId": "l3", "amount": 125, "bidderAlias": "GeoAnalytics_5",   "createdAt": "2026-03-26T09:00:00Z", "status": "pending"},
    {"id": "b7", "listingId": "l3", "amount": 130, "bidderAlias": "UrbanStudies_7",   "createdAt": "2026-03-26T12:00:00Z", "status": "pending"},
    {"id": "b8", "listingId": "l3", "amount": 145, "bidderAlias": "LogisticsPro_2",   "createdAt": "2026-03-27T07:00:00Z", "status": "pending"},
]

_scan_jobs: dict[str, dict] = {}

# ── Dashboard ────────────────────────────────────────────────────────────────

@router.get("/dashboard/stats")
def dashboard_stats():
    return {
        "exposureScore": 67,
        "profileCompletion": 78,
        "dataPoints": 142,
        "pendingApprovals": 8,
        "activeBids": 3,
        "recentActivity": [
            {"id": "1", "type": "scrape_complete",  "message": "LinkedIn scan completed",              "timestamp": "2026-03-28T10:00:00Z", "metadata": {"itemCount": 23}},
            {"id": "2", "type": "bid_received",     "message": "New bid on Professional Profile",     "timestamp": "2026-03-28T09:30:00Z", "metadata": {"amount": 45}},
            {"id": "3", "type": "approval_needed",  "message": "8 items awaiting your review",        "timestamp": "2026-03-28T09:00:00Z", "metadata": {}},
            {"id": "4", "type": "profile_updated",  "message": "Profile completion improved to 78%",  "timestamp": "2026-03-27T18:00:00Z", "metadata": {}},
        ],
        "topSources": [
            {"name": "LinkedIn", "itemCount": 58, "riskLevel": "medium"},
            {"name": "Twitter/X","itemCount": 34, "riskLevel": "low"},
            {"name": "Google",   "itemCount": 28, "riskLevel": "high"},
            {"name": "Facebook", "itemCount": 22, "riskLevel": "medium"},
        ],
    }

# ── Data Map / Graph ─────────────────────────────────────────────────────────

@router.get("/graph")
def graph():
    return {
        "nodes": [
            {"id": "self",        "name": "You",          "type": "self",     "exposure": 1.0,  "category": "identity"},
            {"id": "google",      "name": "Google",       "type": "platform", "exposure": 0.85, "category": "search"},
            {"id": "linkedin",    "name": "LinkedIn",     "type": "platform", "exposure": 0.72, "category": "professional"},
            {"id": "facebook",    "name": "Facebook",     "type": "platform", "exposure": 0.78, "category": "social"},
            {"id": "spotify",     "name": "Spotify",      "type": "platform", "exposure": 0.45, "category": "media"},
            {"id": "amazon",      "name": "Amazon",       "type": "platform", "exposure": 0.68, "category": "commerce"},
            {"id": "acxiom",      "name": "Acxiom",       "type": "broker",   "exposure": 0.91, "category": "data-broker"},
            {"id": "experian",    "name": "Experian",     "type": "broker",   "exposure": 0.88, "category": "credit"},
            {"id": "lexisnexis",  "name": "LexisNexis",   "type": "broker",   "exposure": 0.79, "category": "data-broker"},
            {"id": "doubleclick", "name": "DoubleClick",  "type": "broker",   "exposure": 0.83, "category": "advertising"},
            {"id": "partner1",    "name": "RetailCo",     "type": "partner",  "exposure": 0.35, "category": "retail"},
            {"id": "partner2",    "name": "InsuranceCo",  "type": "partner",  "exposure": 0.42, "category": "insurance"},
            {"id": "partner3",    "name": "NewsletterHub","type": "partner",  "exposure": 0.28, "category": "media"},
            {"id": "partner4",    "name": "AdNetwork",    "type": "partner",  "exposure": 0.61, "category": "advertising"},
            {"id": "partner5",    "name": "Analytics Co", "type": "partner",  "exposure": 0.55, "category": "analytics"},
        ],
        "links": [
            {"source": "self",       "target": "google",      "strength": 0.9,  "type": "direct"},
            {"source": "self",       "target": "linkedin",    "strength": 0.75, "type": "direct"},
            {"source": "self",       "target": "facebook",    "strength": 0.8,  "type": "direct"},
            {"source": "self",       "target": "spotify",     "strength": 0.5,  "type": "direct"},
            {"source": "self",       "target": "amazon",      "strength": 0.7,  "type": "direct"},
            {"source": "google",     "target": "acxiom",      "strength": 0.7,  "type": "data-share"},
            {"source": "google",     "target": "doubleclick", "strength": 0.85, "type": "data-share"},
            {"source": "facebook",   "target": "acxiom",      "strength": 0.65, "type": "data-share"},
            {"source": "facebook",   "target": "partner4",    "strength": 0.6,  "type": "advertising"},
            {"source": "linkedin",   "target": "partner5",    "strength": 0.4,  "type": "analytics"},
            {"source": "amazon",     "target": "experian",    "strength": 0.55, "type": "data-share"},
            {"source": "amazon",     "target": "partner1",    "strength": 0.45, "type": "partner"},
            {"source": "acxiom",     "target": "lexisnexis",  "strength": 0.8,  "type": "data-share"},
            {"source": "acxiom",     "target": "partner2",    "strength": 0.5,  "type": "sale"},
            {"source": "doubleclick","target": "partner4",    "strength": 0.7,  "type": "advertising"},
            {"source": "experian",   "target": "partner2",    "strength": 0.6,  "type": "partner"},
            {"source": "lexisnexis", "target": "partner3",    "strength": 0.35, "type": "sale"},
            {"source": "partner4",   "target": "partner5",    "strength": 0.3,  "type": "analytics"},
        ],
    }

# ── Integrations & Scraped Data ───────────────────────────────────────────────

@router.get("/integrations")
def get_integrations():
    return _integrations

@router.post("/integrations/{integration_id}/toggle")
def toggle_integration(integration_id: str):
    item = next((i for i in _integrations if i["id"] == integration_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Integration not found")
    item["connected"] = not item["connected"]
    if item["connected"]:
        from datetime import datetime, timezone
        item["lastScan"] = datetime.now(timezone.utc).isoformat()
        item["itemCount"] = 15
    else:
        item.pop("lastScan", None)
        item.pop("itemCount", None)
    return item

@router.get("/scraped-items")
def get_scraped_items(status: Optional[str] = Query(None), search: Optional[str] = Query(None)):
    items = list(_scraped_items)
    if status and status != "all":
        items = [i for i in items if i["status"] == status]
    if search:
        s = search.lower()
        items = [i for i in items if s in i["field"].lower() or s in i["value"].lower() or s in i["source"].lower()]
    return {"items": items, "total": len(items)}

@router.patch("/scraped-items/{item_id}")
def patch_scraped_item(item_id: str, body: dict = Body(...)):
    item = next((i for i in _scraped_items if i["id"] == item_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    item["status"] = body.get("status", item["status"])
    return item

@router.post("/scraped-items/batch")
def batch_scraped_items(body: dict = Body(...)):
    ids = body.get("ids", [])
    new_status = body.get("status")
    updated = []
    for item in _scraped_items:
        if item["id"] in ids:
            item["status"] = new_status
            updated.append(item)
    return {"updated": updated, "count": len(updated)}

@router.post("/scrape/run")
def scrape_run():
    import time
    job_id = f"job_{int(time.time())}"
    _scan_jobs[job_id] = {"progress": 0, "complete": False}
    return {"jobId": job_id, "status": "running"}

@router.get("/scrape/status/{job_id}")
def scrape_status(job_id: str):
    job = _scan_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if not job["complete"]:
        job["progress"] = min(job["progress"] + 34, 100)
        if job["progress"] >= 100:
            job["complete"] = True
    return {
        "jobId": job_id,
        "progress": job["progress"],
        "status": "complete" if job["complete"] else "running",
        "message": "Scan complete" if job["complete"] else (
            "Scanning Google..." if job["progress"] < 40 else
            "Scanning LinkedIn..." if job["progress"] < 70 else
            "Scanning remaining sources..."
        ),
    }

# ── Collaborators & Messages ─────────────────────────────────────────────────

@router.get("/collaborators")
def get_collaborators():
    return _collaborators

@router.post("/collaborators/invite", status_code=201)
def invite_collaborator(body: dict = Body(...)):
    import time
    new = {
        "id": f"u{int(time.time())}",
        "name": body.get("email", "").split("@")[0],
        "email": body.get("email"),
        "role": body.get("role", "viewer"),
        "status": "invited",
    }
    _collaborators.append(new)
    return new

@router.delete("/collaborators/{collaborator_id}")
def delete_collaborator(collaborator_id: str):
    idx = next((i for i, c in enumerate(_collaborators) if c["id"] == collaborator_id), None)
    if idx is not None:
        _collaborators.pop(idx)
    return {"success": True}

@router.get("/messages")
def get_messages(topic: Optional[str] = Query(None)):
    return [m for m in _messages if not topic or m.get("topic") == topic]

@router.post("/messages", status_code=201)
def post_message(body: dict = Body(...)):
    import time
    new = {
        "id": f"m{int(time.time())}",
        "authorId": "u1",
        "authorType": "user",
        "content": body.get("content"),
        "timestamp": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "topic": body.get("topic"),
    }
    _messages.append(new)
    return new

# ── Marketplace ───────────────────────────────────────────────────────────────

@router.get("/verification")
def get_verification():
    return {
        "verified": True,
        "score": 87,
        "completedAt": "2024-03-01T00:00:00Z",
        "checks": [
            {"name": "Identity Verified",    "passed": True},
            {"name": "Email Confirmed",      "passed": True},
            {"name": "No Duplicate Data",    "passed": True},
            {"name": "Data Quality Score",   "passed": True},
            {"name": "Privacy Compliance",   "passed": False},
        ],
    }

@router.get("/listings")
def get_listings(status: Optional[str] = Query(None)):
    items = _listings if not status else [l for l in _listings if l["status"] == status]
    return {"listings": items, "total": len(items)}

@router.post("/listings", status_code=201)
def create_listing(body: dict = Body(...)):
    import time
    new = {**body, "id": f"l{int(time.time())}", "bids": 0, "status": "active"}
    _listings.append(new)
    return new

@router.get("/bids")
def get_bids(listingId: Optional[str] = Query(None)):
    return [b for b in _bids if not listingId or b["listingId"] == listingId]

@router.post("/bids/{bid_id}/accept")
def accept_bid(bid_id: str):
    bid = next((b for b in _bids if b["id"] == bid_id), None)
    if bid:
        bid["status"] = "accepted"
        listing = next((l for l in _listings if l["id"] == bid["listingId"]), None)
        if listing:
            listing["status"] = "sold"
    return {"success": True}

@router.post("/bids/{bid_id}/reject")
def reject_bid(bid_id: str):
    bid = next((b for b in _bids if b["id"] == bid_id), None)
    if bid:
        bid["status"] = "rejected"
    return {"success": True}

@router.get("/earnings")
def get_earnings():
    return {
        "totalEarned": 450.00,
        "pending": 175.00,
        "thisMonth": 175.00,
        "lastMonth": 275.00,
        "history": [
            {"month": "Oct 2025", "amount": 120},
            {"month": "Nov 2025", "amount": 200},
            {"month": "Dec 2025", "amount": 180},
            {"month": "Jan 2026", "amount": 95},
            {"month": "Feb 2026", "amount": 275},
            {"month": "Mar 2026", "amount": 175},
        ],
    }

# ── Agent Connections endpoints ───────────────────────────────────────────────

@router.get("/agent-connections")
def get_agent_connections():
    return {"agents": _agent_connections, "mcpUrl": MCP_SERVER_URL}

@router.post("/agent-connections/{agent_id}/toggle")
def toggle_agent_connection(agent_id: str):
    agent = next((a for a in _agent_connections if a["id"] == agent_id), None)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent["connected"] = not agent["connected"]
    if agent["connected"]:
        from datetime import datetime, timezone
        agent["lastConnected"] = datetime.now(timezone.utc).isoformat()
        agent["toolsUsed"] = 0
    else:
        agent.pop("lastConnected", None)
        agent.pop("toolsUsed", None)
    return agent


# ── Perceptions & Export (Reverse Algorithm page) ────────────────────────────

_perceptions: list[dict] = [
    {"platformId": "linkedin",  "platformName": "LinkedIn",  "platformIcon": "linkedin",  "connected": True,  "category": "Professional", "summary": "A senior-level software engineer actively building toward a leadership or staff-eng transition, with a strong Python and React signal and a clear interest cluster around AI/ML tooling and developer productivity.", "confidenceLevel": "very_high", "confidenceScore": 0.91, "exposureScore": 0.72, "dataPoints": 134, "lastUpdated": "2026-03-27T14:30:00Z", "userAccuracyVote": None, "traits": [{"id": "lt1", "label": "Senior Individual Contributor", "category": "Professional", "weight": 0.95}, {"id": "lt2", "label": "Python / React Expert", "category": "Professional", "weight": 0.88}, {"id": "lt3", "label": "AI/ML Interest Cluster", "category": "Professional", "weight": 0.82}, {"id": "lt4", "label": "Career Growth Focus", "category": "Behavioral", "weight": 0.75}, {"id": "lt5", "label": "Dubai Network", "category": "Demographic", "weight": 0.70}, {"id": "lt6", "label": "Open Source Contributor", "category": "Professional", "weight": 0.65}]},
    {"platformId": "google",    "platformName": "Google",    "platformIcon": "google",    "connected": True,  "category": "Consumer",    "summary": "A 28-35 year old developer in a high-income urban bracket. Productivity-maximizing behavior across Google Workspace. Strong early-adopter signal for AI tooling. Travel intent spiking quarterly.", "confidenceLevel": "high", "confidenceScore": 0.78, "exposureScore": 0.68, "dataPoints": 289, "lastUpdated": "2026-03-28T08:00:00Z", "userAccuracyVote": None, "traits": [{"id": "gt1", "label": "Age Bracket: 28-35", "category": "Demographic", "weight": 0.80}, {"id": "gt2", "label": "High-Income Professional", "category": "Demographic", "weight": 0.76}, {"id": "gt3", "label": "Productivity-Obsessed", "category": "Behavioral", "weight": 0.85}, {"id": "gt4", "label": "Early AI Adopter", "category": "Behavioral", "weight": 0.90}, {"id": "gt5", "label": "Urban Dubai Resident", "category": "Demographic", "weight": 0.72}, {"id": "gt6", "label": "Travel Intent (Quarterly)", "category": "Behavioral", "weight": 0.60}]},
    {"platformId": "github",    "platformName": "GitHub",    "platformIcon": "github",    "connected": True,  "category": "Professional", "summary": "Polyglot programmer with TypeScript as primary language and active contribution history. Night-owl coding pattern (10pm-2am commits). Strong OSS engagement and a preference for developer tooling repos.", "confidenceLevel": "very_high", "confidenceScore": 0.93, "exposureScore": 0.85, "dataPoints": 512, "lastUpdated": "2026-03-28T02:15:00Z", "userAccuracyVote": None, "traits": [{"id": "ght1", "label": "TypeScript Primary", "category": "Professional", "weight": 0.92}, {"id": "ght2", "label": "Night-Owl Coder (10pm-2am)", "category": "Behavioral", "weight": 0.88}, {"id": "ght3", "label": "Active OSS Contributor", "category": "Professional", "weight": 0.85}, {"id": "ght4", "label": "Polyglot Programmer", "category": "Professional", "weight": 0.80}, {"id": "ght5", "label": "Developer Tooling Focus", "category": "Professional", "weight": 0.77}, {"id": "ght6", "label": "Solo Project Initiator", "category": "Behavioral", "weight": 0.65}]},
    {"platformId": "spotify",   "platformName": "Spotify",   "platformIcon": "spotify",   "connected": True,  "category": "Productivity", "summary": "Focus-state listener. 70% of listening hours are instrumental or electronic. Session lengths correlate with deep-work blocks. High Discover Weekly engagement signals strong taste novelty preference.", "confidenceLevel": "high", "confidenceScore": 0.84, "exposureScore": 0.55, "dataPoints": 78, "lastUpdated": "2026-03-27T22:00:00Z", "userAccuracyVote": None, "traits": [{"id": "st1", "label": "Focus-State Listener", "category": "Behavioral", "weight": 0.90}, {"id": "st2", "label": "Instrumental / Electronic", "category": "Psychographic", "weight": 0.85}, {"id": "st3", "label": "Deep Work Correlation", "category": "Behavioral", "weight": 0.78}, {"id": "st4", "label": "Taste Novelty Seeker", "category": "Psychographic", "weight": 0.68}]},
    {"platformId": "amazon",    "platformName": "Amazon",    "platformIcon": "amazon",    "connected": False, "category": "Consumer",    "summary": "Amazon has no live data for this account. Connect Amazon to see what purchase patterns and product affinities they have inferred.", "confidenceLevel": "low", "confidenceScore": 0, "exposureScore": 0, "dataPoints": 0, "lastUpdated": "", "userAccuracyVote": None, "traits": []},
    {"platformId": "instagram", "platformName": "Instagram", "platformIcon": "instagram", "connected": False, "category": "Social",      "summary": "Instagram has no live data for this account. Connect Instagram to reveal the aesthetic and content interest graph Meta has built for you.", "confidenceLevel": "low", "confidenceScore": 0, "exposureScore": 0, "dataPoints": 0, "lastUpdated": "", "userAccuracyVote": None, "traits": []},
]

_perception_votes: dict[str, Any] = {p["platformId"]: None for p in _perceptions}

_EXPORT_CONTENT: dict[str, str] = {
    "openai":    "You are a personal AI assistant for Alex Rivera.\n\n## About Alex\n- Senior Full-Stack Engineer based in Dubai, UAE\n- Core expertise: Python, TypeScript, FastAPI, React, LLMs\n- Works at Hyperion Labs (AI / SaaS)\n\n## Professional Identity\nAlex is a senior IC exploring staff-engineer tracks. Deep interest in AI/ML tooling and developer productivity. Active open-source contributor.\n\n## Behavioral Patterns\n- Codes primarily 10pm-2am (night-owl pattern)\n- Deep-work focused: instrumental/electronic music during work sessions\n- Early adopter of AI tooling\n\n## Preferences\n- Concise, technically precise responses\n- Code examples over prose\n- Assumes senior engineer knowledge level",
    "anthropic": "<persona_context>\n  <identity>\n    <name>Alex Rivera</name>\n    <role>Senior Full-Stack Engineer</role>\n    <location>Dubai, UAE</location>\n    <employer>Hyperion Labs</employer>\n  </identity>\n  <professional_profile source=\"linkedin\" confidence=\"0.91\">\n    <expertise>Python, TypeScript, FastAPI, React, LLMs</expertise>\n    <career_trajectory>Senior IC to Staff Engineer track</career_trajectory>\n  </professional_profile>\n  <behavioral_signals>\n    <coding_pattern source=\"github\" confidence=\"0.93\">Night-owl (10pm-2am peak commits)</coding_pattern>\n    <focus_style source=\"spotify\" confidence=\"0.84\">Deep work with instrumental/electronic music</focus_style>\n    <adopter_curve source=\"google\" confidence=\"0.78\">Early adopter of AI tooling</adopter_curve>\n  </behavioral_signals>\n  <communication_preferences>\n    <style>Technical and concise</style>\n    <examples>Strongly preferred</examples>\n    <assumed_knowledge>Senior engineer level</assumed_knowledge>\n  </communication_preferences>\n</persona_context>",
    "gemini":    "Personalization Profile — Alex Rivera\n\nPROFESSIONAL CONTEXT\nRole: Senior Full-Stack Engineer @ Hyperion Labs, Dubai\nSkills: Python, TypeScript, FastAPI, React, LLMs\nOSS: Active contributor, night-owl coding pattern (10pm-2am)\n\nBEHAVIORAL CONTEXT\nFocus mode: Deep work with instrumental/electronic music\nAdoption curve: Early adopter of AI tooling\nCareer signal: Exploring staff-eng/leadership tracks\n\nINTERACTION PREFERENCES\n- Technically precise, minimal fluff\n- Code examples strongly preferred\n- Assumes senior-level knowledge",
    "json":      '{"schema":"persona-sync/v1","subject":{"name":"Alex Rivera","location":"Dubai, UAE","role":"Senior Full-Stack Engineer","employer":"Hyperion Labs"},"algorithmicProfile":{"linkedin":{"confidence":0.91,"traits":["Senior IC","Python/TypeScript/React","AI/ML interest","OSS contributor"]},"github":{"confidence":0.93,"traits":["Night-owl coder","Polyglot","Developer tooling focus"]},"google":{"confidence":0.78,"traits":["28-35 bracket","High-income urban","Early AI adopter"]},"spotify":{"confidence":0.84,"traits":["Focus-state listener","Instrumental/electronic","Deep-work correlation"]}}}',
    "markdown":  "# Alex Rivera - Persona Profile\n\n## Identity\n| Field | Value |\n|---|---|\n| Name | Alex Rivera |\n| Role | Senior Full-Stack Engineer |\n| Employer | Hyperion Labs |\n| Location | Dubai, UAE |\n\n## What Algorithms Think About You\n\n### LinkedIn (Confidence: 91%)\n- Senior IC on a staff-eng track\n- Core: Python, TypeScript, FastAPI, React\n\n### GitHub (Confidence: 93%)\n- Night-owl coder - peak commits 10pm-2am\n- Developer tooling and OSS focus\n\n### Google (Confidence: 78%)\n- Early AI adopter\n- Productivity-maximizing behavior\n\n### Spotify (Confidence: 84%)\n- Focus-state listener\n- 70% instrumental / electronic content",
}


@router.get("/perceptions")
def get_perceptions():
    from datetime import datetime, timezone
    result = [
        {**p, "userAccuracyVote": _perception_votes.get(p["platformId"])}
        for p in _perceptions
    ]
    return {
        "perceptions": result,
        "totalPlatforms": len(_perceptions),
        "connectedPlatforms": sum(1 for p in _perceptions if p["connected"]),
        "lastAnalyzed": datetime.now(timezone.utc).isoformat(),
    }


@router.patch("/perceptions/{platform_id}/vote")
def vote_perception(platform_id: str, body: dict = Body(...)):
    if platform_id not in _perception_votes:
        raise HTTPException(status_code=404, detail="Platform not found")
    _perception_votes[platform_id] = body.get("vote")
    return {"platformId": platform_id, "vote": _perception_votes[platform_id]}


@router.get("/export/{format_id}")
def export_persona(format_id: str):
    from datetime import datetime, timezone
    content = _EXPORT_CONTENT.get(format_id)
    if content is None:
        raise HTTPException(status_code=400, detail="Unknown format")
    return {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "version": "1",
        "format": format_id,
        "content": content,
    }
