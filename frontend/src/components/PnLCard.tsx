import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PnLCard(){
  const pnl = 324.12; // demo
  const positive = pnl >= 0;
  return (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
      className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">P&L (Today)</h2>
        {positive ? <ArrowUpRight className="text-green-500" /> : <ArrowDownRight className="text-red-500" />}
      </div>
      <div className={`text-3xl font-bold mt-2 ${positive ? 'text-green-500' : 'text-red-500'}`}>
        {positive ? '+' : '-'}${Math.abs(pnl).toFixed(2)}
      </div>
      <div className="text-xs text-gray-500 mt-1">* Demo values — wire to backend /journal later</div>
    </motion.div>
  );
}
