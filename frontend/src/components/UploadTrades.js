import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";
export default function UploadTrades({ onUploaded }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");
    const handleUpload = async () => {
        if (!file)
            return alert("Select a CSV file first!");
        setStatus("Uploading...");
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post(`${API_BASE}/trades/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setStatus(`✅ Imported ${res.data.rows_imported} trades`);
            onUploaded(); // refresh journal
        }
        catch (err) {
            setStatus("❌ Upload failed: " + (err.response?.data?.detail || err.message));
        }
    };
    return (_jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800", children: [_jsx("h2", { className: "font-semibold mb-2", children: "Upload Trades CSV" }), _jsx("input", { type: "file", accept: ".csv", onChange: (e) => setFile(e.target.files?.[0] || null), className: "block w-full text-sm text-gray-600 mb-2" }), _jsx("button", { onClick: handleUpload, className: "px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90", children: "Upload" }), status && _jsx("p", { className: "text-sm mt-2", children: status })] }));
}
