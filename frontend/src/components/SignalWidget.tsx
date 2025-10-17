import { useSignal } from '../hooks/useMarket';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SignalWidget(){
  const signal = useSignal();
  const isBuy = signal === 'BUY';
  return (
    <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
      className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Strategy Signal</h2>
        {isBuy ? <TrendingUp className="text-green-500" /> : <TrendingDown className="text-red-500" />}
      </div>
      <div className={`text-xl font-bold mt-2 ${isBuy ? 'text-green-500' : 'text-red-500'}`}>
        {signal || '...'}
      </div>
      <div className="text-xs text-gray-500 mt-1">MA crossover demo signal</div>
    </motion.div>
  );
}
