from fastapi import Header, HTTPException, status
from config import supabase


def sign_up(email: str, password: str):
    return supabase.auth.sign_up({"email": email, "password": password})


def sign_in(email: str, password: str):
    return supabase.auth.sign_in_with_password({"email": email, "password": password})


def get_current_user(authorization: str = Header(...)) -> dict:
    """
    FastAPI dependency. Expects: Authorization: Bearer <access_token>
    Verifies the token by asking Supabase's Auth API directly (rather than
    decoding it locally), so this works whether the project uses the legacy
    shared HS256 JWT secret or Supabase's newer asymmetric signing keys.
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.removeprefix("Bearer ").strip()

    try:
        result = supabase.auth.get_user(token)
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")

    if not result or not result.user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired session")

    return {"id": result.user.id, "email": result.user.email}


def require_admin(user: dict) -> None:
    profile = supabase.table("profiles").select("is_admin").eq("id", user["id"]).single().execute()
    if not profile.data or not profile.data.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")