from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, Base
from .routers import auth

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Digital Brain API")

# Allow CORS for local frontend execution
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since we're running locally via Electron/File, allow all
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Get the directory of the currently currently running file (backend context)
# We want to serve ../frontend as static files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

app.mount("/app", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

@app.get("/")
def read_root():
    # Redirect root to our frontend app dashboard
    return RedirectResponse(url="/app/")
