import sqlite3
from pathlib import Path
from typing import Optional

DB_PATH = Path(__file__).parent / "persona_sync.db"


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_connection()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS profile_fields (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section TEXT NOT NULL,
            field_key TEXT NOT NULL,
            field_value TEXT,
            data_type TEXT DEFAULT 'text',
            source TEXT DEFAULT 'user',
            status TEXT DEFAULT 'approved',
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(section, field_key)
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS profile_schema (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            section TEXT NOT NULL,
            field_key TEXT NOT NULL,
            label TEXT NOT NULL,
            description TEXT,
            data_type TEXT DEFAULT 'text',
            required INTEGER DEFAULT 0,
            sort_order INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()


def seed_schema():
    """Insert default schema rows if the table is empty."""
    conn = get_connection()
    count = conn.execute("SELECT COUNT(*) FROM profile_schema").fetchone()[0]
    if count > 0:
        conn.close()
        return

    rows = [
        # Identity
        ("identity", "full_name",           "Full Name",            "Your legal full name",                 "text",  1, 1),
        ("identity", "date_of_birth",        "Date of Birth",        "YYYY-MM-DD",                           "date",  0, 2),
        ("identity", "city",                 "City",                 "City you currently live in",           "text",  0, 3),
        ("identity", "country",              "Country",              "Country of residence",                 "text",  0, 4),
        ("identity", "languages",            "Languages",            "Comma-separated list",                 "text",  0, 5),
        # Professional
        ("professional", "job_title",        "Job Title",            "Your current role",                    "text",  0, 1),
        ("professional", "company",          "Company",              "Where you work",                       "text",  0, 2),
        ("professional", "industry",         "Industry",             "e.g. Software, Finance",               "text",  0, 3),
        ("professional", "years_experience", "Years of Experience",  "Total years in your field",            "number",0, 4),
        ("professional", "skills",           "Skills",               "Comma-separated list of skills",       "text",  0, 5),
        ("professional", "bio",              "Professional Bio",     "Short professional summary",           "text",  0, 6),
        # Preferences
        ("preferences", "interests",         "Interests",            "Topics you enjoy",                     "text",  0, 1),
        ("preferences", "hobbies",           "Hobbies",              "What you do outside work",             "text",  0, 2),
        ("preferences", "communication_style","Communication Style", "e.g. direct, collaborative",           "text",  0, 3),
        ("preferences", "learning_style",    "Learning Style",       "e.g. visual, hands-on, reading",       "text",  0, 4),
        # Goals
        ("goals", "short_term",              "Short-Term Goals",     "Goals for the next 3-6 months",        "text",  0, 1),
        ("goals", "long_term",               "Long-Term Vision",     "Where you want to be in 3-5 years",    "text",  0, 2),
        ("goals", "current_focus",           "Current Focus",        "What you are working on right now",    "text",  0, 3),
        # Context
        ("context", "timezone",              "Timezone",             "e.g. UTC+3, America/New_York",         "text",  0, 1),
        ("context", "availability",          "Availability",         "e.g. weekdays 9-5",                    "text",  0, 2),
        ("context", "preferred_contact",     "Preferred Contact",    "e.g. email, Slack, phone",             "text",  0, 3),
    ]

    conn.executemany("""
        INSERT INTO profile_schema (section, field_key, label, description, data_type, required, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, rows)
    conn.commit()
    conn.close()


def get_schema() -> dict:
    conn = get_connection()
    rows = conn.execute(
        "SELECT * FROM profile_schema ORDER BY section, sort_order"
    ).fetchall()
    conn.close()
    result: dict = {}
    for row in rows:
        sec = row["section"]
        if sec not in result:
            result[sec] = []
        result[sec].append(dict(row))
    return result


def get_profile(section: Optional[str] = None) -> dict:
    conn = get_connection()
    if section:
        rows = conn.execute(
            "SELECT * FROM profile_fields WHERE section = ? AND status = 'approved'",
            (section,)
        ).fetchall()
    else:
        rows = conn.execute(
            "SELECT * FROM profile_fields WHERE status = 'approved'"
        ).fetchall()
    conn.close()

    result: dict = {}
    for row in rows:
        sec = row["section"]
        if sec not in result:
            result[sec] = {}
        result[sec][row["field_key"]] = row["field_value"]

    if section:
        return result.get(section, {})
    return result


def upsert_field(section: str, field_key: str, field_value: str,
                 data_type: str = "text", source: str = "user"):
    conn = get_connection()
    conn.execute("""
        INSERT INTO profile_fields (section, field_key, field_value, data_type, source)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(section, field_key) DO UPDATE SET
            field_value = excluded.field_value,
            data_type   = excluded.data_type,
            source      = excluded.source,
            timestamp   = CURRENT_TIMESTAMP
    """, (section, field_key, field_value, data_type, source))
    conn.commit()
    conn.close()


def search_profile(query: str) -> list:
    conn = get_connection()
    rows = conn.execute("""
        SELECT section, field_key, field_value
        FROM profile_fields
        WHERE status = 'approved'
          AND (field_key LIKE ? OR field_value LIKE ?)
    """, (f"%{query}%", f"%{query}%")).fetchall()
    conn.close()
    return [dict(row) for row in rows]
