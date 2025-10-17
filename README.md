# Sankalp Trade AI — MVP

Monorepo for **Sankalp Trade AI** (frontend + backend). Uses `.env` for configuration.

## Quick Start

### 1) Backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Copy envs
cp ../.env.example ../.env   # then edit ../.env with your values

# run
uvicorn main:app --reload --host ${BACKEND_HOST:-0.0.0.0} --port ${BACKEND_PORT:-8000}
```

API will be on `http://localhost:8000`. Docs: http://localhost:8000/docs

### 2) Frontend
```bash
cd frontend
cp .env.example .env             # set VITE_API_BASE (e.g., http://localhost:8000)
npm i
npm run dev
```

Open `http://localhost:5173`

---

## Environment Variables

- Root `.env` configures the **backend** (FastAPI). See `.env.example` in the repo root.
- `frontend/.env` configures the **frontend** Vite app; see `frontend/.env.example`.

---

## Notes
- Database defaults to SQLite file `sankalp.db` for local dev. Set `DATABASE_URL` to Postgres for Supabase.
- Risk guardrails are controlled by `MAX_RISK_PCT` and `MAX_POSITION_VALUE` envs.
- AI Assistant uses `OPENAI_API_KEY` and `OPENAI_MODEL` from env.
