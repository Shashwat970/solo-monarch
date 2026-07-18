"""
Vercel Python Serverless Function entrypoint.

Vercel's @vercel/python runtime looks for a top-level `app` object here
and, if it's an ASGI app (which FastAPI is), serves it directly. The
`vercel.json` sibling routes all incoming requests to this file.
"""
import sys
from pathlib import Path

# Make sibling modules (main, config, routers, ...) importable when Vercel
# executes this file from the /api directory.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from main import app  # noqa: E402,F401