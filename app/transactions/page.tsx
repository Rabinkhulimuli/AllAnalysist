import TransactionsTable from '@/src/presentation/features/Transactions/TransactionsTable';

export const metadata = {
  title: 'Transactions',
  description: 'Your canonical financial ledger.',
};

export default function TransactionsPage() {
  return <TransactionsTable />;
}
