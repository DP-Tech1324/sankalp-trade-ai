# Placeholder Zerodha service. Wire actual Kite Connect here.
from pydantic import BaseModel

class KiteOrder(BaseModel):
    symbol: str
    side: str
    qty: float
    price: float | None = None
    order_type: str = "market"

async def place_order(order: KiteOrder):
    # TODO: Integrate Zerodha Kite Connect
    return {"provider": "zerodha", "echo": order.dict(), "status": "PAPER_OK"}
