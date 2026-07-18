from fastapi import APIRouter, Depends
from config import supabase
from auth import get_current_user

router = APIRouter(prefix="/user", tags=["user"])


@router.get("/me")
def me(user=Depends(get_current_user)):
    res = supabase.table("profiles").select("*").eq("id", user["id"]).single().execute()
    return res.data