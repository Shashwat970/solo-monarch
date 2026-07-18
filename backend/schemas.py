from pydantic import BaseModel, EmailStr


class SignUpRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: str = "Hunter"
    weight_kg: float = 70


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LogWorkoutRequest(BaseModel):
    pushups: int = 0
    squats: int = 0
    running_km: float = 0
    plank_seconds: int = 0