"""
Central config. All secrets come from environment variables — never hardcode
them here and never commit a real .env file.
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")  # not required by the backend currently, kept for future use

if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise RuntimeError(
        "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. "
        "Copy backend/.env.example to backend/.env (locally) or set them in "
        "your Vercel project's Environment Variables (in production)."
    )

# service_role key -> full DB access, used ONLY on the backend, NEVER sent to the frontend.
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)