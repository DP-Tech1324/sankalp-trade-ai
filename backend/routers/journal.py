from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db, Base, engine
from models.trade import Trade

router = APIRouter(prefix="/journal", tags=["Trade Journal"])

# Ensure tables exist
Base.metadata.create_all(bind=engine)

class JournalEntry(BaseModel):
    symbol: str
    side: str
    qty: float
    price: float
    notes: str | None = None

@router.get("/journal/trades")
def get_trades(db: Session = Depends(get_db)):
    trades = db.query(Trade).order_by(Trade.id.desc()).limit(500).all()
    return [
        {
            "id": t.id,
            "symbol": t.symbol,
            "side": t.side,
            "qty": t.qty,
            "price": t.price,
            "exchange": t.exchange or "-",
            "product": t.product or "-",
            "brokerage": t.brokerage or "-",
            "net_amount": t.net_amount or "-",
            "date": t.date or "-",
            "time": t.created_at.strftime("%I:%M:%S %p") if t.created_at is not None else "-",
        }
        for t in trades
    ]

@router.post("/log")
def log(entry: JournalEntry, db: Session = Depends(get_db)):
    t = Trade(symbol=entry.symbol, side=entry.side, qty=entry.qty, price=entry.price, status="LOGGED")
    db.add(t); db.commit(); db.refresh(t)
    return {"status":"ok","id":t.id}
