from datetime import date
from fastapi import APIRouter, Depends
from config import supabase
from auth import get_current_user
from schemas import LogWorkoutRequest
import ranks
from calories import estimate_calories

router = APIRouter(prefix="/workout", tags=["workout"])


def _get_profile(user_id: str) -> dict:
    res = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
    return res.data


@router.get("/today")
def get_today(user=Depends(get_current_user)):
    profile = _get_profile(user["id"])
    today = str(date.today())

    existing = supabase.table("daily_progress").select("*") \
        .eq("user_id", user["id"]).eq("log_date", today).execute()
    progress = existing.data[0] if existing.data else None

    return {
        "rank": profile["rank"],
        "targets": ranks.get_targets(profile["rank"]),
        "streak_days": profile["streak_days"],
        "days_required_for_next_rank": ranks.days_required(profile["rank"]),
        "next_rank": ranks.next_rank(profile["rank"]),
        "relax_day_available": profile["relax_day_available"],
        "today_progress": progress,
    }


@router.post("/log")
def log_workout(body: LogWorkoutRequest, user=Depends(get_current_user)):
    profile = _get_profile(user["id"])
    today = str(date.today())
    rank = profile["rank"]

    calories = estimate_calories(
        profile["weight_kg"], body.pushups, body.squats, body.running_km, body.plank_seconds
    )
    target_met = ranks.check_target_met(rank, body.pushups, body.squats, body.running_km, body.plank_seconds)

    row = {
        "user_id": user["id"],
        "log_date": today,
        "pushups": body.pushups,
        "squats": body.squats,
        "running_km": body.running_km,
        "plank_seconds": body.plank_seconds,
        "calories_burned": calories,
        "target_met": target_met,
        "was_relax_day": profile["relax_day_available"],
        "rank_at_time": rank,
    }
    supabase.table("daily_progress").upsert(row, on_conflict="user_id,log_date").execute()

    profile_update = {"last_active_date": today}
    ranked_up = False
    new_rank = rank

    if profile["relax_day_available"]:
        # Today was a free pass — it doesn't add to or break the streak.
        profile_update["relax_day_available"] = False
    elif target_met:
        streak = profile["streak_days"] + 1
        required = ranks.days_required(rank)
        if required is not None and streak >= required:
            # RANK UP
            new_rank = ranks.next_rank(rank)
            profile_update.update({
                "rank": new_rank,
                "streak_days": 0,
                "relax_day_available": True,  # 1 relax day awarded after a rank-up
                "best_streak": max(profile["best_streak"], streak),
            })
            supabase.table("rank_history").insert({
                "user_id": user["id"], "from_rank": rank, "to_rank": new_rank,
            }).execute()
            ranked_up = True
        else:
            profile_update.update({
                "streak_days": streak,
                "best_streak": max(profile["best_streak"], streak),
            })
    else:
        # Target missed -> streak resets
        profile_update["streak_days"] = 0

    supabase.table("profiles").update(profile_update).eq("id", user["id"]).execute()

    return {
        "calories_burned": calories,
        "target_met": target_met,
        "ranked_up": ranked_up,
        "new_rank": new_rank,
        "streak_days": profile_update.get("streak_days", profile["streak_days"]),
    }


@router.get("/history")
def get_history(user=Depends(get_current_user)):
    res = supabase.table("daily_progress").select("*") \
        .eq("user_id", user["id"]).order("log_date", desc=True).limit(90).execute()
    return res.data