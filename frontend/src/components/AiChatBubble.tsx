import React, { useState } from "react";
import { Send, MessageSquare, PlugZap } from "lucide-react";

const AiChatBubble: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
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
    } catch (err) {
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
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "⚠️ Failed to connect to trades." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="w-80 h-[26rem] bg-white dark:bg-gray-900 shadow-xl rounded-xl flex flex-col border border-gray-300">
          <div className="flex justify-between items-center px-3 py-2 border-b border-gray-300">
            <h3 className="font-semibold text-sm">Sankalp Trade Copilot</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleConnect}
                className={`text-xs flex items-center px-2 py-1 rounded ${
                  connected
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
                disabled={loading}
                title="Connect to trade data"
              >
                <PlugZap size={14} className="mr-1" />
                {connected ? "Connected" : "Connect"}
              </button>
              <button onClick={() => setOpen(false)}>✖️</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`my-1 p-2 rounded-md ${
                  m.role === "user"
                    ? "bg-blue-100 text-right"
                    : "bg-gray-200 text-left"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          <div className="flex border-t border-gray-300">
            <input
              className="flex-1 p-2 text-sm outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                connected
                  ? "Ask about your trades..."
                  : "Connect to trade data first..."
              }
            />
            <button
              onClick={handleSend}
              className="p-2 bg-blue-500 text-white rounded-tr-xl"
              disabled={!connected}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-105 transition"
          onClick={() => setOpen(true)}
          title="Chat with Sankalp AI"
        >
          <MessageSquare size={22} />
        </button>
      )}
    </div>
  );
};

export default AiChatBubble;
