import FinanceDashboard from '@/src/presentation/features/Dashboard';

export const metadata = {
  title: 'Financial Overview',
  description: 'Profit, expenses, income and trading analytics from your documents.',
};

export default function DashboardPage() {
  return <FinanceDashboard />;
}
