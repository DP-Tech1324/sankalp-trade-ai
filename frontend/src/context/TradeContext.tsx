import React, { createContext, useContext, useState } from "react"

type TradeContextType = {
  refreshKey: number
  triggerRefresh: () => void
}

const TradeContext = createContext<TradeContextType>({
  refreshKey: 0,
  triggerRefresh: () => {},
})

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0)
  const triggerRefresh = () => setRefreshKey((k) => k + 1)

  return (
    <TradeContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </TradeContext.Provider>
  )
}

export const useTradeContext = () => useContext(TradeContext)
