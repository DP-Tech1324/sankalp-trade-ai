from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import os
from groq import Groq
from database import get_db
from models.trade import Trade
from collections import deque
import traceback
import pandas as pd

router = APIRouter(prefix="/ai", tags=["AI Chat"])

# 🔑 Initialize Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))

# 🧠 In-memory conversation + trade cache
conversation_memory = deque(maxlen=10)
trade_context_cache = ""
portfolio_summary = {}


# 🔹 Helper: Build Portfolio Summary
def generate_portfolio_summary(trades):
    if not trades:
        return {"summary_text": "No trades available."}

    df = pd.DataFrame(
        [{"symbol": t.symbol, "side": t.side, "qty": t.qty, "price": t.price} for t in trades]
    )

    # Summary metrics
    total_trades = len(df)
    total_qty = df["qty"].sum()
    avg_price = df["price"].mean()
    total_value = (df["qty"] * df["price"]).sum()

    # Buy/Sell stats
    buys = len(df[df["side"].str.upper() == "BUY"])
    sells = len(df[df["side"].str.upper() == "SELL"])
    ratio = round(buys / sells, 2) if sells > 0 else "All Buys"

    # Top performer by average price
    avg_prices = df.groupby("symbol")["price"].mean().sort_values(ascending=False)
    top_symbol = avg_prices.index[0]
    top_price = avg_prices.iloc[0]

    summary = {
        "total_trades": total_trades,
        "total_qty": int(total_qty),
        "total_value": round(total_value, 2),
        "avg_price": round(avg_price, 2),
        "buys": buys,
        "sells": sells,
        "buy_sell_ratio": ratio,
        "top_stock": top_symbol,
        "top_price": round(top_price, 2),
    }

    # Markdown version for AI chat
    summary_md = (
        f"📊 **Portfolio Summary Card**\n\n"
        f"**Total Trades:** {total_trades}\n"
        f"**Total Quantity:** {total_qty:,}\n"
        f"**Total Value:** ₹{total_value:,.2f}\n"
        f"**Average Price:** ₹{avg_price:,.2f}\n"
        f"**Buy/Sell Ratio:** {ratio}\n"
        f"💎 **Top Stock:** {top_symbol} (Avg ₹{top_price:,.2f})\n"
    )

    summary["summary_text"] = summary_md
    return summary


# 🔹 Connect endpoint (loads trade context)
@router.post("/connect")
async def ai_connect(db: Session = Depends(get_db)):
    global trade_context_cache, portfolio_summary
    trades = db.query(Trade).order_by(Trade.id.desc()).limit(None).all()

    if not trades:
        trade_context_cache = ""
        portfolio_summary = {}
        return {"connected": False, "message": "No trades found to analyze."}

    # Generate context and summary
    lines = [f"{t.symbol} {t.side} {t.qty} @ ₹{t.price}" for t in trades]
    trade_context_cache = "\n".join(lines)
    portfolio_summary = generate_portfolio_summary(trades)

    return {
        "connected": True,
        "message": f"Loaded {len(trades)} trades into memory.",
        "summary": portfolio_summary,
    }


# 🔹 Chat endpoint
@router.post("/chat")
async def ai_chat(payload: dict):
    """Chat endpoint using Groq with human-like style + summary card context."""
    user_message = payload.get("message", "").strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Empty message")

    # Store message
    conversation_memory.append({"role": "user", "content": user_message})

    # System prompt (context + summary)
    system_prompt = (
        "You are **Sankalp Trade Copilot**, a friendly AI portfolio analyst. "
        "You speak naturally, use markdown for readability, and give clear insights.\n\n"
        "Combine data analysis with conversational tone. Include emojis and practical suggestions.\n\n"
        f"Here’s the portfolio context:\n\n"
        f"{trade_context_cache or 'No trades connected yet.'}\n\n"
        f"{portfolio_summary.get('summary_text', '')}"
    )

    try:
        # 🧠 Try the main model, fallback if needed
        try:
            completion = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": system_prompt},
                    *list(conversation_memory),
                ],
            )
        except Exception as model_error:
            print("⚠️ Primary model failed, retrying Mixtral:", model_error)
            completion = client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=[
                    {"role": "system", "content": system_prompt},
                    *list(conversation_memory),
                ],
            )

        content = completion.choices[0].message.content
        reply = content.strip() if content is not None else "No response from AI."
        conversation_memory.append({"role": "assistant", "content": reply})

        # Include portfolio summary JSON for frontend
        return {"reply": reply, "summary": portfolio_summary}

    except Exception as e:
        print("❌ Groq API error:\n", traceback.format_exc())
        return {"reply": f"⚠️ Groq API error: {str(e)}"}
    
@router.get("/signals")
async def ai_trade_signals(db: Session = Depends(get_db)):
    """
    Analyze recent trades and generate buy/sell/hold signals using Groq AI.
    """
    trades = db.query(Trade).order_by(Trade.id.desc()).limit(50).all()
    if not trades:
        raise HTTPException(status_code=404, detail="No trades found to analyze.")

    # Convert to DataFrame
    df = pd.DataFrame(
        [{"symbol": t.symbol, "side": t.side, "qty": t.qty, "price": t.price} for t in trades]
    )

    # Build compact numerical context
    context_lines = []
    for symbol, group in df.groupby("symbol"):
        avg_price = group["price"].mean()
        total_qty = group["qty"].sum()
        context_lines.append(f"{symbol}: avg ₹{avg_price:.2f}, qty {total_qty}")

    context_summary = "\n".join(context_lines)

    # System prompt for signals
    system_prompt = (
        "You are Sankalp Trade Copilot — an AI trade signal generator.\n\n"
        "Analyze the trader’s positions and generate up to 5 actionable signals.\n"
        "Each signal should include: Symbol, Action (Buy/Sell/Hold), Confidence %, and Reasoning.\n"
        "Be concise, human, and use emojis for quick readability.\n\n"
        f"Recent trade data:\n{context_summary}"
    )

    try:
        completion = client.chat.completions.create(
            model="qwen/qwen3-32b",
            messages=[{"role": "system", "content": system_prompt}],
        )

        content = completion.choices[0].message.content
        reply = content.strip() if content is not None else "No response from AI."

        # Optional: parse to structured JSON if needed
        # For now, return as markdown
        return {"signals_text": reply}

    except Exception as e:
        print("❌ Signal generation error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Groq API error: {str(e)}")

