import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_routes, workout_routes, user_routes, admin_routes

app = FastAPI(title="Solo Fit API")

# Comma-separated list in env, e.g.
# CORS_ORIGINS=http://localhost:5173,https://solo-fit.vercel.app
_raw_origins = os.getenv("CORS_ORIGINS", "https://solo-monarch-backend.vercel.app")
allow_origins = [o.strip() for o in _raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(workout_routes.router)
app.include_router(user_routes.router)
app.include_router(admin_routes.router)


@app.get("/")
def root():
    return {"status": "Solo Fit API is running"}