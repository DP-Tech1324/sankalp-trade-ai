from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import broker, strategy, ai, journal, trades_csv
from config import CORS_ORIGINS
from database import Base, engine

app = FastAPI(title="Sankalp Trade AI - API")

# Auto-create tables (SQLite dev)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS if CORS_ORIGINS != ["*"] else ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(broker.router)
app.include_router(strategy.router)
app.include_router(ai.router)
app.include_router(journal.router)
app.include_router(trades_csv.router)

@app.get("/")
def root():
    return {"status": "ok", "message": "Sankalp Trade AI backend running"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "uptime": "ok"}