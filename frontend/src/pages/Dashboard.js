import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import MarketOverview from "../components/MarketOverview";
import PnLCard from "../components/PnLCard";
import MarketMood from "../components/MarketMood";
import TradeJournal from "../components/TradeJournal";
import AiChatBubble from "../components/AiChatBubble";
import { useTradeContext } from "../context/TradeContext";
import ConfirmModal from "../components/ConfirmModal";
export default function Dashboard() {
    const appName = import.meta.env.VITE_APP_NAME || "Sankalp Trade AI";
    const API_BASE = import.meta.env.VITE_API_BASE;
    const navigate = useNavigate();
    const { refreshKey, triggerRefresh } = useTradeContext();
    const [clearing, setClearing] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const handleClearTrades = async () => {
        setClearing(true);
        try {
            const res = await fetch(`${API_BASE}/trades/clear`, { method: "DELETE" });
            const data = await res.json();
            if (data.status === "ok") {
                setModalMessage(`🧹 Cleared ${data.deleted} trades successfully!`);
                triggerRefresh();
                // delay to show message for 1.5s, then go to /import
                setTimeout(() => navigate("/import"), 1500);
            }
            else {
                setModalMessage("❌ Failed to clear trades.");
            }
        }
        catch (err) {
            console.error(err);
            setModalMessage("❌ Error clearing trades.");
        }
        finally {
            setClearing(false);
            setShowConfirm(false);
        }
    };
    return (_jsxs("main", { className: "min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100", children: [_jsxs("header", { className: "flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800", children: [_jsx("h1", { className: "text-2xl font-bold", children: appName }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("button", { onClick: () => setShowConfirm(true), disabled: clearing, className: "px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50", children: clearing ? "Clearing..." : "🧹 Clear Journal & Import New" }), _jsx(ThemeToggle, {})] })] }), _jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6 p-6", children: [_jsx("div", { className: "lg:col-span-2 grid gap-6", children: _jsx(MarketOverview, {}) }), _jsxs("div", { className: "grid gap-6", children: [_jsx(PnLCard, {}), _jsx(AiChatBubble, {}), _jsx(MarketMood, {})] }), _jsx("div", { className: "lg:col-span-3 grid gap-6", children: _jsx(TradeJournal, {}, refreshKey) })] }), _jsx(ConfirmModal, { open: showConfirm, title: "Confirm Journal Reset", message: "This will permanently delete all current trades from your journal. Do you want to continue?", onConfirm: handleClearTrades, onCancel: () => setShowConfirm(false), confirmText: "Yes, Clear & Import", cancelText: "Cancel" }), modalMessage && (_jsx("div", { className: "fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in", children: modalMessage }))] }));
}
