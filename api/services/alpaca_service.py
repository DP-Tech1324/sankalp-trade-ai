# Placeholder Alpaca service. Wire actual REST endpoints here.
from pydantic import BaseModel

class AlpacaOrder(BaseModel):
    symbol: str
    side: str
    qty: float
    price: float | None = None
    order_type: str = "market"

async def place_order(order: AlpacaOrder):
    # TODO: Integrate Alpaca API
    return {"provider": "alpaca", "echo": order.dict(), "status": "PAPER_OK"}
