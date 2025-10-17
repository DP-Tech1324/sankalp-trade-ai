import { useTrades } from "../hooks/useMarketData";

export default function TradeJournal() {
  const { rows, refresh } = useTrades();

  return (
    <div className="bg-white rounded p-4 shadow">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold">Trade Journal</h2>
        <button
          onClick={refresh}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Symbol</th>
              <th className="border p-2">Side</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Exchange</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Brokerage</th>
              <th className="border p-2">Net Amount</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t, i) => {
              const meta = t.meta || {};
              return (
                <tr key={t.id}>
                  <td className="border p-2 text-center">{i + 1}</td>
                  <td className="border p-2">{t.symbol || "-"}</td>
                  <td className="border p-2">{t.side || "-"}</td>
                  <td className="border p-2 text-right">{t.qty || 0}</td>
                  <td className="border p-2 text-right">
                    ₹{t.price ? t.price.toFixed(2) : "0.00"}
                  </td>
                  <td className="border p-2">{t.exchange || meta.Exch || "-"}</td>
                  <td className="border p-2">{t.product || meta.Product || "-"}</td>
                  <td className="border p-2">{t.brokerage || meta["Brok Amt"] || "-"}</td>
                  <td className="border p-2">{t.net_amount || meta["Net Amt"] || "-"}</td>
                  <td className="border p-2">{t.date || meta["Trd Dt"] || "-"}</td>
                  <td className="border p-2">
                    {t.created_at
                      ? new Date(t.created_at).toLocaleTimeString()
                      : "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
