export default function MarketMood(){
  // Placeholder mood (wire real sentiment later)
  return (
    <div className="bg-white rounded p-4 shadow">
      <h2 className="font-semibold mb-2">Market Mood</h2>
      <div className="flex gap-3 items-center">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <div className="text-sm text-gray-600">Greed leaning (demo)</div>
      </div>
    </div>
  );
}
