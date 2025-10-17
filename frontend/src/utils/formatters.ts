export const fmtMoney = (n: number, ccy = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: ccy }).format(n);
