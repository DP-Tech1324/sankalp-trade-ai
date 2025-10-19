import { useState, useEffect } from "react";
import axios from "axios";

export function useMarket() {
  const [signal, setSignal] = useState<"BUY" | "SELL" | "HOLD">("HOLD");
  const [marketMood, setMarketMood] = useState<number>(0);

  useEffect(() => {
    axios
      .get("/api/indices")
      .then((res) => {
        const data = res.data?.data || [];
        if (data.length > 0) {
          const change = data[0].pChange || 0;
          setMarketMood(change);
          setSignal(change > 0 ? "BUY" : change < 0 ? "SELL" : "HOLD");
        }
      })
      .catch(() => {
        setSignal("HOLD");
        setMarketMood(0);
      });
  }, []);

  return { signal, marketMood };
}