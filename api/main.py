from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import broker, strategy, ai, journal, trades_csv
from database import Base, engine
from config import CORS_ORIGINS

app = FastAPI(title="Sankalp Trade AI - API (Local + Serverless)")

# Auto-create DB tables
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(broker.router)
app.include_router(strategy.router)
app.include_router(ai.router)
app.include_router(journal.router)
app.include_router(trades_csv.router)

@app.get("/api")
def root():
    return {"status": "ok", "message": "Sankalp Trade AI backend running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "uptime": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
