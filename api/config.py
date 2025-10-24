from dotenv import load_dotenv
import os

# Load .env from repo root (../.env when running from backend/)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

BACKEND_HOST = os.getenv("BACKEND_HOST", "0.0.0.0")
BACKEND_PORT = int(os.getenv("BACKEND_PORT", "8000"))
CORS_ORIGINS = [o.strip() for o in os.getenv("BACKEND_CORS_ORIGINS", "*").split(",")]

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./sankalp.db")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

ZERODHA_API_KEY = os.getenv("ZERODHA_API_KEY")
ZERODHA_API_SECRET = os.getenv("ZERODHA_API_SECRET")
ALPACA_KEY_ID = os.getenv("ALPACA_KEY_ID")
ALPACA_SECRET_KEY = os.getenv("ALPACA_SECRET_KEY")

MAX_RISK_PCT = float(os.getenv("MAX_RISK_PCT", "2"))
MAX_POSITION_VALUE = float(os.getenv("MAX_POSITION_VALUE", "5000"))
