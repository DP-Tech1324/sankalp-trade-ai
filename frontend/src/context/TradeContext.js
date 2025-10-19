import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from "react";
const TradeContext = createContext({
    refreshKey: 0,
    triggerRefresh: () => { },
});
export const TradeProvider = ({ children }) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const triggerRefresh = () => setRefreshKey((k) => k + 1);
    return (_jsx(TradeContext.Provider, { value: { refreshKey, triggerRefresh }, children: children }));
};
export const useTradeContext = () => useContext(TradeContext);
