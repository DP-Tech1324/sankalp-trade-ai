from fastapi import APIRouter
import pandas as pd, numpy as np

router = APIRouter(prefix="/strategy", tags=["Strategy"])

@router.get("/ma_crossover")
def ma_crossover(short:int=9,long:int=21):
    np.random.seed(42)
    data = pd.Series(np.random.normal(100, 2, 200)).cumsum() / 10 + 200
    short_ma = data.rolling(short).mean()
    long_ma  = data.rolling(long).mean()
    signal = "BUY" if short_ma.iloc[-1] > long_ma.iloc[-1] else "SELL"
    return {"signal": signal, "short": float(short_ma.iloc[-1]), "long": float(long_ma.iloc[-1])}
