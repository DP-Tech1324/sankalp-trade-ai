import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';
export default function PnLCard() {
    const pnl = 324.12; // demo
    const positive = pnl >= 0;
    return (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "bg-white dark:bg-gray-900 rounded-xl p-4 shadow border border-gray-100 dark:border-gray-800", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "font-semibold", children: "P&L (Today)" }), positive ? _jsx(ArrowUpRight, { className: "text-green-500" }) : _jsx(ArrowDownRight, { className: "text-red-500" })] }), _jsxs("div", { className: `text-3xl font-bold mt-2 ${positive ? 'text-green-500' : 'text-red-500'}`, children: [positive ? '+' : '-', "$", Math.abs(pnl).toFixed(2)] }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: "* Demo values \u2014 wire to backend /journal later" })] }));
}
