import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ConfirmModal({ open, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", }) {
    if (!open)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm", children: _jsxs("div", { className: "bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-[400px]", children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: title }), _jsx("p", { className: "text-gray-700 dark:text-gray-300 mb-4", children: message }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { onClick: onCancel, className: "px-3 py-1 rounded border border-gray-400 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800", children: cancelText }), _jsx("button", { onClick: onConfirm, className: "px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700", children: confirmText })] })] }) }));
}
