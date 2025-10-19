export const fmtMoney = (n, ccy = 'USD') => new Intl.NumberFormat('en-US', { style: 'currency', currency: ccy }).format(n);
