from fastapi import APIRouter, HTTPException
from schemas import SignUpRequest, LoginRequest
from config import supabase
import auth as auth_lib

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
def signup(body: SignUpRequest):
    result = auth_lib.sign_up(body.email, body.password)
    if not result.user:
        raise HTTPException(status_code=400, detail="Could not create account")

    supabase.table("profiles").insert({
        "id": result.user.id,
        "email": body.email,
        "display_name": body.display_name,
        "weight_kg": body.weight_kg,
    }).execute()

    return {"message": "Account created. Check your email to confirm, then log in."}


@router.post("/login")
def login(body: LoginRequest):
    try:
        result = auth_lib.sign_in(body.email, body.password)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "access_token": result.session.access_token,
        "user_id": result.user.id,
        "email": result.user.email,
    }