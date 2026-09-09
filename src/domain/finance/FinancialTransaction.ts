// Canonical financial domain types matching the backend /packages/schemas.

export type TransactionType =
  | 'income'
  | 'expense'
  | 'buy'
  | 'sell'
  | 'deposit'
  | 'withdrawal'
  | 'transfer'
  | 'fee'
  | 'dividend'
  | 'interest'
  | 'refund'
  | 'tax';

export type TradeSide = 'BUY' | 'SELL';

export interface Money {
  amount: string;
  currency: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  source_document_id: string | null;
  account_id: string | null;
  record_type: string;
  transaction_type: TransactionType | null;
  date: string | null;
  amount: string | null;
  currency: string | null;
  category: string | null;
  merchant: string | null;
  asset: string | null;
  quantity: string | null;
  price: string | null;
  fees: string | null;
  trade_side: TradeSide | null;
  source_page: number | null;
  source_row: number | null;
  reference: string | null;
  confidence: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionListResponse {
  items: FinancialTransaction[];
  total: number;
}
