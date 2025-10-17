import { useEffect, useState } from "react";
import axios from "axios";

const base = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export function useSignal() {
  const [signal, setSignal] = useState<string>('');
  useEffect(() => {
    axios.get(`${base}/strategy/ma_crossover`).then(r => setSignal(r.data.signal)).catch(()=>{});
  }, []);
  return signal;
}

export function useTrades() {
  const [rows, setRows] = useState<any[]>([])
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000"

  const refresh = async () => {
    try {
      const res = await fetch(`${API_BASE}/trades/list`)
      if (!res.ok) throw new Error("Failed to load trades")
      const data = await res.json()
      setRows(data)
    } catch (err) {
      console.error("❌ Failed to fetch trades:", err)
      setRows([])
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  return { rows, refresh }
}
export function useAskAI() {
  const ask = async (q: string) => {
    const res = await axios.post(`${base}/ai/chat`, { question: q });
    return res.data.answer;
  };
  return ask;
}
