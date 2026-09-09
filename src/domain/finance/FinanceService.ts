import { AnalyticsExpensesResponse, AnalyticsTradingResponse, DashboardSummary } from './Analytics';
import { TransactionListResponse } from './FinancialTransaction';

export interface DashboardParams {
  from?: string;
  to?: string;
}

export interface TransactionQuery {
  from?: string;
  to?: string;
  transaction_type?: string;
  category?: string;
  offset?: number;
  limit?: number;
}

export interface IFinanceService {
  getDashboard(params: DashboardParams): Promise<DashboardSummary>;
  getTransactions(query: TransactionQuery): Promise<TransactionListResponse>;
  getExpenses(params: DashboardParams): Promise<AnalyticsExpensesResponse>;
  getTrading(params: DashboardParams): Promise<AnalyticsTradingResponse>;
}
