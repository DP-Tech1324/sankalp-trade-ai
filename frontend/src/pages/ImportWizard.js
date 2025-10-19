import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useTradeContext } from "../context/TradeContext";
import { useNavigate } from "react-router-dom";
export default function ImportWizard() {
    const [file, setFile] = useState(null);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [mapping, setMapping] = useState({});
    const [imported, setImported] = useState(null);
    const [rowLimit, setRowLimit] = useState(50);
    const [message, setMessage] = useState(null);
    const [preview, setPreview] = useState([]);
    const [totalRows, setTotalRows] = useState(0);
    const API_BASE = import.meta.env.VITE_API_BASE;
    const { triggerRefresh } = useTradeContext();
    const navigate = useNavigate();
    const handlePreview = async () => {
        if (!file)
            return;
        const form = new FormData();
        form.append("file", file);
        const res = await fetch(`${API_BASE}/trades/preview`, { method: "POST", body: form });
        const data = await res.json();
        setColumns(data.columns);
        setRows(data.rows); // all rows for import
        setPreview(data.preview || data.rows.slice(0, 10)); // only first 10 for preview
        setTotalRows(data.total_rows || data.rows.length);
    };
    const handleImport = async () => {
        const selectedRows = rowLimit >= rows.length ? rows : rows.slice(0, rowLimit);
        const res = await fetch(`${API_BASE}/trades/import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mapping, rows: selectedRows }),
        });
        const data = await res.json();
        setImported(data.rows_imported);
        if (data.rows_imported) {
            triggerRefresh();
            setMessage(`✅ Imported ${data.rows_imported} trades successfully! Redirecting to Dashboard...`);
            setTimeout(() => navigate("/"), 1800);
        }
        else {
            setMessage("❌ Import failed. Please check your mapping and CSV.");
        }
    };
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-xl font-bold mb-3", children: "\uD83D\uDCE5 Trade Import Wizard" }), _jsxs("div", { className: "mb-4 flex items-center gap-3", children: [_jsx("input", { type: "file", accept: ".csv", onChange: (e) => setFile(e.target.files?.[0] || null), className: "border p-2 rounded" }), _jsx("button", { onClick: handlePreview, className: "px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700", children: "Preview" })] }), rows.length > 0 && (_jsxs("div", { className: "mb-5 border rounded-lg p-4 bg-white dark:bg-gray-900", children: [_jsxs("p", { className: "font-medium mb-2", children: ["Total rows found: ", _jsx("strong", { children: rows.length })] }), _jsxs("label", { className: "block mb-4", children: ["Import first", " ", _jsx("input", { type: "number", value: rowLimit, onChange: (e) => setRowLimit(Number(e.target.value)), min: 1, max: rows.length, className: "w-20 border rounded px-2 py-1 mx-1" }), "rows"] }), _jsx("h2", { className: "font-semibold mb-2", children: "\uD83E\uDDED Step 2 \u2014 Map Columns" }), [
                        "symbol",
                        "side",
                        "qty",
                        "price",
                        "exchange",
                        "product",
                        "brokerage",
                        "net_amount",
                        "date",
                    ].map((key) => (_jsxs("div", { className: "mb-2", children: [_jsxs("label", { className: "mr-2 w-32 inline-block capitalize", children: [key, ":"] }), _jsxs("select", { onChange: (e) => setMapping({ ...mapping, [key]: e.target.value }), className: "border rounded px-2 py-1", children: [_jsx("option", { value: "", children: "-- select column --" }), columns.map((c) => (_jsx("option", { value: c, children: c }, c)))] })] }, key))), _jsx("button", { onClick: handleImport, className: "mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700", children: "Import Selected Rows" })] })), rows.length > 0 && (_jsxs("div", { className: "mt-5 overflow-auto border rounded-lg p-3 bg-white dark:bg-gray-900", children: [_jsxs("h3", { className: "font-semibold mb-2", children: ["\uD83D\uDCCA Preview (showing first ", Math.min(rowLimit, 10), " rows)"] }), _jsxs("table", { className: "min-w-full border text-sm", children: [_jsx("thead", { children: _jsx("tr", { children: columns.map((c) => (_jsx("th", { className: "border px-2 py-1 bg-gray-100 dark:bg-gray-800", children: c }, c))) }) }), _jsx("tbody", { children: rows.slice(0, Math.min(rowLimit, 10)).map((r, i) => (_jsx("tr", { children: columns.map((c) => (_jsx("td", { className: "border px-2 py-1", children: r[c] }, c))) }, i))) })] })] })), message && (_jsx("div", { className: "fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in", children: message }))] }));
}
