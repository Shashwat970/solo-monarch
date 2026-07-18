from fastapi import APIRouter, Depends
from config import supabase
from auth import get_current_user, require_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users")
def list_users(user=Depends(get_current_user)):
    require_admin(user)
    res = supabase.table("profiles").select("*").order("created_at", desc=True).execute()
    return res.data


@router.get("/users/{user_id}/history")
def user_history(user_id: str, user=Depends(get_current_user)):
    require_admin(user)
    res = supabase.table("daily_progress").select("*") \
        .eq("user_id", user_id).order("log_date", desc=True).execute()
    return res.data


@router.get("/stats")
def platform_stats(user=Depends(get_current_user)):
    require_admin(user)
    profiles = supabase.table("profiles").select("rank").execute().data
    rank_counts: dict[str, int] = {}
    for p in profiles:
        rank_counts[p["rank"]] = rank_counts.get(p["rank"], 0) + 1
    return {"total_users": len(profiles), "rank_distribution": rank_counts}