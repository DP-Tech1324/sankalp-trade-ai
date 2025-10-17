import React, { useState } from "react"
import { useTradeContext } from "../context/TradeContext"
import { useNavigate } from "react-router-dom"

export default function ImportWizard() {
  const [file, setFile] = useState<File | null>(null)
  const [columns, setColumns] = useState<string[]>([])
  const [rows, setRows] = useState<any[]>([])
  const [mapping, setMapping] = useState<any>({})
  const [imported, setImported] = useState<number | null>(null)
  const [rowLimit, setRowLimit] = useState<number>(50)
  const [message, setMessage] = useState<string | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [totalRows, setTotalRows] = useState<number>(0)

  const API_BASE = import.meta.env.VITE_API_BASE
  const { triggerRefresh } = useTradeContext()
  const navigate = useNavigate()

  const handlePreview = async () => {
    if (!file) return
    const form = new FormData()
    form.append("file", file)
    const res = await fetch(`${API_BASE}/trades/preview`, { method: "POST", body: form })
    const data = await res.json()
    setColumns(data.columns)
  setRows(data.rows) // all rows for import
  setPreview(data.preview || data.rows.slice(0, 10)) // only first 10 for preview
  setTotalRows(data.total_rows || data.rows.length)
  }

  const handleImport = async () => {
    const selectedRows = rowLimit >= rows.length ? rows : rows.slice(0, rowLimit)
    const res = await fetch(`${API_BASE}/trades/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mapping, rows: selectedRows }),
    })
    const data = await res.json()
    setImported(data.rows_imported)

    if (data.rows_imported) {
      triggerRefresh()
      setMessage(`✅ Imported ${data.rows_imported} trades successfully! Redirecting to Dashboard...`)
      setTimeout(() => navigate("/"), 1800)
    } else {
      setMessage("❌ Import failed. Please check your mapping and CSV.")
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-3">📥 Trade Import Wizard</h1>

      {/* Step 1: Upload */}
      <div className="mb-4 flex items-center gap-3">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="border p-2 rounded"
        />
        <button
          onClick={handlePreview}
          className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Preview
        </button>
      </div>

      {/* Step 2: Row count & mapping */}
      {rows.length > 0 && (
        <div className="mb-5 border rounded-lg p-4 bg-white dark:bg-gray-900">
          <p className="font-medium mb-2">
            Total rows found: <strong>{rows.length}</strong>
          </p>
          <label className="block mb-4">
            Import first{" "}
            <input
              type="number"
              value={rowLimit}
              onChange={(e) => setRowLimit(Number(e.target.value))}
              min={1}
              max={rows.length}
              className="w-20 border rounded px-2 py-1 mx-1"
            />
            rows
          </label>

          <h2 className="font-semibold mb-2">🧭 Step 2 — Map Columns</h2>
          {[
            "symbol",
            "side",
            "qty",
            "price",
            "exchange",
            "product",
            "brokerage",
            "net_amount",
            "date",
          ].map((key) => (
            <div key={key} className="mb-2">
              <label className="mr-2 w-32 inline-block capitalize">{key}:</label>
              <select
                onChange={(e) => setMapping({ ...mapping, [key]: e.target.value })}
                className="border rounded px-2 py-1"
              >
                <option value="">-- select column --</option>
                {columns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            onClick={handleImport}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Import Selected Rows
          </button>
        </div>
      )}

      {/* Step 3: Preview */}
      {rows.length > 0 && (
        <div className="mt-5 overflow-auto border rounded-lg p-3 bg-white dark:bg-gray-900">
          <h3 className="font-semibold mb-2">
            📊 Preview (showing first {Math.min(rowLimit, 10)} rows)
          </h3>
          <table className="min-w-full border text-sm">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c} className="border px-2 py-1 bg-gray-100 dark:bg-gray-800">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, Math.min(rowLimit, 10)).map((r, i) => (
                <tr key={i}>
                  {columns.map((c) => (
                    <td key={c} className="border px-2 py-1">
                      {r[c]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Import Summary Toast */}
      {message && (
        <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {message}
        </div>
      )}
    </div>
  )
}
