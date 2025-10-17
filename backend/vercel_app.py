# vercel_app.py
from backend.main import app  # import your FastAPI instance

# Vercel looks for "app" by default
# You don’t need uvicorn.run() here — Vercel handles that
