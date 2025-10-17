# vercel_app.py
from main import app  # import your FastAPI instance


# Vercel looks for "app" by default
# Do NOT call uvicorn.run() here — Vercel handles the server.
