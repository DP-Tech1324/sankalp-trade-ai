from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models.trade import Trade
from services.risk_guard import check_position_risk
from services.zerodha_service import place_order as zerodha_place
from services.alpaca_service import place_order as alpaca_place

router = APIRouter(prefix="/broker", tags=["Broker"])

class Order(BaseModel):
    symbol: str
    side: str  # BUY or SELL
    qty: float
    price: float | None = None
    order_type: str = "market"
    broker: str = "paper"  # zerodha | alpaca | paper
    equity: float = 10000  # account size for risk checks

@router.post("/place")
async def place(order: Order, db: Session = Depends(get_db)):
    ok, msg = check_position_risk(price=order.price or 100, qty=order.qty, equity=order.equity)
    if not ok:
        return {"status": "rejected", "reason": msg}

    if order.broker == "zerodha":
        res = await zerodha_place(order)
    elif order.broker == "alpaca":
        res = await alpaca_place(order)
    else:
        res = {"provider": "paper", "echo": order.dict(), "status": "PAPER_OK"}

    trade = Trade(symbol=order.symbol, side=order.side, qty=order.qty,
                  price=order.price or 0.0, order_type=order.order_type, status="FILLED",
                  meta={"broker_response": res})
    db.add(trade); db.commit(); db.refresh(trade)
    return {"status": "ok", "trade_id": trade.id, "broker": res.get("provider")}
