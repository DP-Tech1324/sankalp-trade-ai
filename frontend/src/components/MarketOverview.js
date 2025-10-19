import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
const gen = () => Array.from({ length: 40 }).map((_, i) => ({ x: i, y: 100 + Math.sin(i / 4) * 5 + (Math.random() - 0.5) * 2 }));
export default function MarketOverview() {
    const data = gen();
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h2", { className: "font-semibold text-gray-800 dark:text-gray-100", children: "Market Overview" }), _jsx("span", { className: "text-xs text-gray-500", children: "Demo chart" })] }), _jsx("div", { className: "h-56", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: data, children: [_jsx(XAxis, { dataKey: "x", hide: true }), _jsx(YAxis, { hide: true, domain: ['dataMin - 5', 'dataMax + 5'] }), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "y", stroke: "#0ea5e9", strokeWidth: 2, dot: false })] }) }) })] }));
}
