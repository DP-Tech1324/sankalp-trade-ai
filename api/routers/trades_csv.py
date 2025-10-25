from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.trade import Trade
import pandas as pd
from io import StringIO

router = APIRouter(prefix="/trades", tags=["Trades CSV"])

# -----------------------------
# 1. PREVIEW STEP
# -----------------------------
@router.post("/preview")
async def preview_trades(file: UploadFile = File(...)):
    """Preview uploaded CSV — return columns, first 10 rows, and total rows."""
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    contents = await file.read()
    decoded = contents.decode("utf-8", errors="ignore")

    try:
        df = pd.read_csv(StringIO(decoded), on_bad_lines="skip", engine="python")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"CSV parse error: {e}")

    # 🧹 Normalize headers: strip spaces + uppercase
    df.columns = [str(c).strip().upper() for c in df.columns]

    # 🧮 Real total count
    df = df.replace([float("inf"), float("-inf")], None).fillna("")
    total_rows = len(df)

    return {
        "columns": list(df.columns),
        "preview": df.head(10).to_dict(orient="records"),
        "rows": df.to_dict(orient="records"),  # full dataset for import
        "total_rows": total_rows,
    }


# -----------------------------
# 2. IMPORT STEP (Final Universal Version)
# -----------------------------
@router.post("/import")
async def import_csv(payload: dict, db: Session = Depends(get_db)):
    """Import broker CSV (case-insensitive, supports all variants)."""
    rows = payload.get("rows")
    if not rows:
        raise HTTPException(status_code=400, detail="Missing rows in payload")

    df = pd.DataFrame(rows)
    df = df.replace([float("inf"), float("-inf")], None).fillna("")

    # 🧭 Normalize headers (case-insensitive)
    normalized_cols = {c.lower().strip(): c for c in df.columns}

    def get_val(row, *keys):
        """Safely fetch value by trying multiple possible keys (case-insensitive)."""
        for k in keys:
            for name in [k, k.lower(), k.upper()]:
                if name in row:
                    return row[name]
            for norm in normalized_cols:
                if norm == k.lower():
                    return row.get(normalized_cols[norm])
        return None

    imported = 0
    for _, row in df.iterrows():
        try:
            symbol = str(get_val(row, "TICKER SYMBOL", "Scrip Name") or "").strip()
            side = str(get_val(row, "TRADE TYPE", "Buy/Sell") or "").upper()
            qty = float(get_val(row, "QUANTITY", "Qty") or 0)
            price = float(get_val(row, "NET RATE PER UNIT", "Mkt Price") or 0)
            brokerage = str(get_val(row, "BROKERAGE", "Brok Amt") or "-")
            net_amt = str(get_val(row, "NET TRADE VALUE", "Net Amt") or "-")
            exch = str(get_val(row, "EXCH", "Exchange") or "-")
            product = str(get_val(row, "PRODUCT", "Prod") or "-")
            date = str(get_val(row, "DATE", "Trd Dt") or "-")

            trade = Trade(
                symbol=symbol,
                side=side,
                qty=qty,
                price=price,
                exchange=exch,
                product=product,
                brokerage=brokerage,
                net_amount=net_amt,
                date=date,
                status="IMPORTED",
                meta={
                    "Exchange": exch,
                    "Product": product,
                    "Brokerage": brokerage,
                    "Net Amount": net_amt,
                    "Date": date,
                },
            )

            db.add(trade)
            imported += 1
        except Exception as e:
            print(f"⚠️ Skipped bad row: {e}")

    db.commit()
    return {"status": "ok", "rows_imported": imported}



# -----------------------------
# 3. CLEAR TRADES
# -----------------------------
@router.delete("/clear")
async def clear_trades(db: Session = Depends(get_db)):
    """Delete all trades from the journal."""
    try:
        deleted = db.query(Trade).delete()
        db.commit()
        return {"status": "ok", "deleted": deleted}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to clear trades: {e}")

# -----------------------------
# 4. GET ALL TRADES (for dashboard)
# -----------------------------
@router.get("/list")
async def list_trades(db: Session = Depends(get_db)):
    """Return all imported trades for the dashboard."""
    try:
        trades = db.query(Trade).order_by(Trade.id.desc()).all()
        return [
            {
                "id": t.id,
                "symbol": t.symbol,
                "side": t.side,
                "qty": t.qty,
                "price": t.price,
                "exchange": t.exchange,
                "product": t.product,
                "brokerage": t.brokerage,
                "net_amount": t.net_amount,
                "date": t.date,
                "status": t.status,
            }
            for t in trades
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load trades: {e}")