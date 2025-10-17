import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const gen = () => Array.from({length: 40}).map((_,i)=>({ x:i, y: 100 + Math.sin(i/4)*5 + (Math.random()-0.5)*2 }));

export default function MarketOverview(){
  const data = gen();
  return (
    <motion.div
      initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
      className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Market Overview</h2>
        <span className="text-xs text-gray-500">Demo chart</span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="x" hide />
            <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
            <Tooltip />
            <Line type="monotone" dataKey="y" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
