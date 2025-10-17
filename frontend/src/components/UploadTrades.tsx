import { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export default function UploadTrades({ onUploaded }: { onUploaded: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleUpload = async () => {
    if (!file) return alert("Select a CSV file first!");
    setStatus("Uploading...");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(`${API_BASE}/trades/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setStatus(`✅ Imported ${res.data.rows_imported} trades`);
      onUploaded(); // refresh journal
    } catch (err: any) {
      setStatus("❌ Upload failed: " + (err.response?.data?.detail || err.message));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
      <h2 className="font-semibold mb-2">Upload Trades CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="block w-full text-sm text-gray-600 mb-2"
      />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:opacity-90"
      >
        Upload
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}
    </div>
  );
}
