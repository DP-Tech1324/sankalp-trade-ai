from config import MAX_RISK_PCT, MAX_POSITION_VALUE

def check_position_risk(price: float, qty: float, equity: float):
    notional = price * qty
    if notional > MAX_POSITION_VALUE:
        return False, f"Notional ${notional:.2f} exceeds MAX_POSITION_VALUE ${MAX_POSITION_VALUE:.2f}"
    per_trade_risk = (price * 0.01) * qty  # naive risk: 1% move
    if (per_trade_risk / equity) * 100 > MAX_RISK_PCT:
        return False, f"Per-trade risk {per_trade_risk:.2f} exceeds {MAX_RISK_PCT}% of equity"
    return True, "OK"
