"""
Rough calorie-burn estimates from exercise volume. These are simplified
MET-based formulas scaled by the user's body weight — good enough for a
gamified fitness app, NOT medical-grade. Tune the constants as you like.
"""

REFERENCE_WEIGHT_KG = 70.0


def estimate_calories(weight_kg: float, pushups: int, squats: int, running_km: float, plank_seconds: int) -> float:
    scale = weight_kg / REFERENCE_WEIGHT_KG

    pushup_cal = pushups * 0.29 * scale
    squat_cal = squats * 0.32 * scale
    plank_minutes = plank_seconds / 60
    plank_cal = plank_minutes * (3.5 * 3.5 * weight_kg / 200)  # MET 3.5
    running_cal = running_km * weight_kg * 1.036  # ~1 kcal per kg per km

    total = pushup_cal + squat_cal + plank_cal + running_cal
    return round(total, 1)