import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Send, MessageSquare, PlugZap } from "lucide-react";
const AiChatBubble = () => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSend = async () => {
        if (!input.trim())
            return;
        const userMsg = { role: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        try {
            const res = await fetch("http://localhost:8000/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
        }
        catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: "⚠️ AI unavailable." },
            ]);
        }
    };
    const handleConnect = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8000/ai/connect", {
                method: "POST",
            });
            const data = await res.json();
            setConnected(data.connected);
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: data.message },
            ]);
        }
        catch (err) {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", text: "⚠️ Failed to connect to trades." },
            ]);
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "fixed bottom-6 right-6 z-50", children: open ? (_jsxs("div", { className: "w-80 h-[26rem] bg-white dark:bg-gray-900 shadow-xl rounded-xl flex flex-col border border-gray-300", children: [_jsxs("div", { className: "flex justify-between items-center px-3 py-2 border-b border-gray-300", children: [_jsx("h3", { className: "font-semibold text-sm", children: "Sankalp Trade Copilot" }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsxs("button", { onClick: handleConnect, className: `text-xs flex items-center px-2 py-1 rounded ${connected
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-200 text-gray-600"}`, disabled: loading, title: "Connect to trade data", children: [_jsx(PlugZap, { size: 14, className: "mr-1" }), connected ? "Connected" : "Connect"] }), _jsx("button", { onClick: () => setOpen(false), children: "\u2716\uFE0F" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-2 text-sm", children: messages.map((m, i) => (_jsx("div", { className: `my-1 p-2 rounded-md ${m.role === "user"
                            ? "bg-blue-100 text-right"
                            : "bg-gray-200 text-left"}`, children: m.text }, i))) }), _jsxs("div", { className: "flex border-t border-gray-300", children: [_jsx("input", { className: "flex-1 p-2 text-sm outline-none", value: input, onChange: (e) => setInput(e.target.value), placeholder: connected
                                ? "Ask about your trades..."
                                : "Connect to trade data first..." }), _jsx("button", { onClick: handleSend, className: "p-2 bg-blue-500 text-white rounded-tr-xl", disabled: !connected, children: _jsx(Send, { size: 16 }) })] })] })) : (_jsx("button", { className: "bg-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-105 transition", onClick: () => setOpen(true), title: "Chat with Sankalp AI", children: _jsx(MessageSquare, { size: 22 }) })) }));
};
export default AiChatBubble;
