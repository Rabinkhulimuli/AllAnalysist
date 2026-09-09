import {
  AnalyticsExpensesResponse,
  AnalyticsTradingResponse,
  DashboardSummary,
} from '@/src/domain/finance/Analytics';
import {
  DashboardParams,
  IFinanceService,
  TransactionQuery,
} from '@/src/domain/finance/FinanceService';
import { TransactionListResponse } from '@/src/domain/finance/FinancialTransaction';

function toQuery(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

export class FinanceRepository implements IFinanceService {
  async getDashboard(params: DashboardParams): Promise<DashboardSummary> {
    const res = await fetch(`/api/dashboard${toQuery(params)}`, { cache: 'no-store' });
    return handle<DashboardSummary>(res);
  }

  async getTransactions(query: TransactionQuery): Promise<TransactionListResponse> {
    const res = await fetch(`/api/transactions${toQuery({ ...query })}`, { cache: 'no-store' });
    return handle<TransactionListResponse>(res);
  }

  async getExpenses(params: DashboardParams): Promise<AnalyticsExpensesResponse> {
    const res = await fetch(`/api/analytics/expenses${toQuery(params)}`, { cache: 'no-store' });
    return handle<AnalyticsExpensesResponse>(res);
  }

  async getTrading(params: DashboardParams): Promise<AnalyticsTradingResponse> {
    const res = await fetch(`/api/analytics/trading${toQuery(params)}`, { cache: 'no-store' });
    return handle<AnalyticsTradingResponse>(res);
  }
}

export const financeRepository = new FinanceRepository();
