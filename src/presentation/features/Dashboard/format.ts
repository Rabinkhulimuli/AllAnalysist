import { Money, TransactionType } from '@/src/domain/finance/FinancialTransaction';

const CURRENCY_SYMBOLS: Record<string, string> = {
  NPR: 'Rs',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
};

export function formatMoney(money: Pick<Money, 'amount' | 'currency'>): string {
  const amount = Number(money.amount);
  const symbol = CURRENCY_SYMBOLS[money.currency] ?? `${money.currency} `;
  const abs = Math.abs(amount);
  return `${symbol}${abs.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `;
  return `${symbol}${Math.abs(amount).toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}

export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString('en-US');
}

export function typeLabel(type: TransactionType): string {
  const labels: Record<TransactionType, string> = {
    income: 'Income',
    expense: 'Expense',
    buy: 'Buy',
    sell: 'Sell',
    deposit: 'Deposit',
    withdrawal: 'Withdrawal',
    transfer: 'Transfer',
    fee: 'Fee',
    dividend: 'Dividend',
    interest: 'Interest',
    refund: 'Refund',
    tax: 'Tax',
  };
  return labels[type] ?? type;
}

export function monthLabel(month: string): string {
  const [year, m] = month.split('-').map(Number);
  const names = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${names[(m ?? 1) - 1]} '${String(year).slice(2)}`;
}
