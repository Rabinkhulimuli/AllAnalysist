import { Money } from './FinancialTransaction';

export interface TradingSummary {
  buy_volume: Money;
  sell_volume: Money;
  realized_gain: Money;
}

export interface ExpenseCategorySummary {
  category: string;
  amount: Money;
}

export interface MonthlySummary {
  month: string; // "2026-01"
  income: Money;
  expenses: Money;
  net_profit: Money;
  trading: TradingSummary | null;
}

export interface DashboardSummary {
  period_from: string;
  period_to: string;
  income: Money;
  expenses: Money;
  net_profit: Money;
  trading_gain: Money;
  trading: TradingSummary;
  expenses_by_category: ExpenseCategorySummary[];
  monthly: MonthlySummary[];
}

export interface AnalyticsExpensesResponse {
  total: Money;
  by_category: ExpenseCategorySummary[];
  by_month: { month: string; amount: number; currency: string }[];
}

export interface AnalyticsTradingResponse {
  summary: TradingSummary;
  per_asset: {
    asset: string;
    currency: string;
    buy_quantity: number;
    buy_volume: number;
    sell_quantity: number;
    sell_volume: number;
    realized_gain: number;
  }[];
}
