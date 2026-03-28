"""
Stdio entry point for Claude Desktop (and any MCP client that uses stdio transport).
Run via: python stdio_server.py
"""
import sys
from pathlib import Path

# Ensure imports resolve correctly regardless of working directory
sys.path.insert(0, str(Path(__file__).parent))

import database
from mcp_server import mcp

if __name__ == "__main__":
    database.init_db()
    database.seed_schema()
    mcp.run(transport="stdio")
