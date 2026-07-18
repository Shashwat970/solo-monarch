"""
The rank ladder, daily targets per rank, and the consecutive-day rule
needed to rank up. Change the numbers here to rebalance the whole app.
"""

RANK_ORDER = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS"]

# Daily targets per rank. Plank target matches the brief: F=30s ... SSS=600s.
TARGETS = {
    "F":   {"pushups": 10,  "squats": 10,  "running_km": 1.0, "plank_seconds": 30},
    "E":   {"pushups": 20,  "squats": 20,  "running_km": 1.5, "plank_seconds": 60},
    "D":   {"pushups": 30,  "squats": 30,  "running_km": 2.0, "plank_seconds": 90},
    "C":   {"pushups": 45,  "squats": 45,  "running_km": 2.5, "plank_seconds": 150},
    "B":   {"pushups": 60,  "squats": 60,  "running_km": 3.0, "plank_seconds": 210},
    "A":   {"pushups": 80,  "squats": 80,  "running_km": 4.0, "plank_seconds": 300},
    "S":   {"pushups": 100, "squats": 100, "running_km": 5.0, "plank_seconds": 400},
    "SS":  {"pushups": 130, "squats": 130, "running_km": 6.5, "plank_seconds": 500},
    "SSS": {"pushups": 150, "squats": 150, "running_km": 8.0, "plank_seconds": 600},
}

# Consecutive days of hitting the daily target required to rank up FROM this rank.
# Pattern requested: 15, 12, 10, 8 — repeated across the 8 transitions.
_CYCLE = [15, 12, 10, 8]
DAYS_TO_RANK_UP = {
    RANK_ORDER[i]: _CYCLE[i % len(_CYCLE)]
    for i in range(len(RANK_ORDER) - 1)  # no target needed for the final rank, SSS
}


def next_rank(current: str) -> str | None:
    idx = RANK_ORDER.index(current)
    if idx + 1 < len(RANK_ORDER):
        return RANK_ORDER[idx + 1]
    return None  # already at SSS, the cap


def get_targets(rank: str) -> dict:
    return TARGETS[rank]


def days_required(rank: str) -> int | None:
    return DAYS_TO_RANK_UP.get(rank)  # None at SSS (max rank, no further rank-up)


def check_target_met(rank: str, pushups: int, squats: int, running_km: float, plank_seconds: int) -> bool:
    t = get_targets(rank)
    return (
        pushups >= t["pushups"]
        and squats >= t["squats"]
        and running_km >= t["running_km"]
        and plank_seconds >= t["plank_seconds"]
    )