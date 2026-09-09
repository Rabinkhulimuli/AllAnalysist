'use client';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DashboardSummary } from '@/src/domain/finance/Analytics';
import { financeRepository } from '@/src/infrastructure/finance/FinanceRepository';
import { ExpenseBreakdown } from '@/src/presentation/features/Dashboard/components/ExpenseBreakdown';
import { FinancialSummaryCards } from '@/src/presentation/features/Dashboard/components/FinancialSummaryCards';
import { MonthlyPerformance } from '@/src/presentation/features/Dashboard/components/MonthlyPerformance';
import { TradingPanel } from '@/src/presentation/features/Dashboard/components/TradingPanel';

type Props = {
  initial?: DashboardSummary | null;
};

export default function FinanceDashboard({ initial }: Props) {
  const [data, setData] = useState<DashboardSummary | null>(initial ?? null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(!initial);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await financeRepository.getDashboard({});
      setData(result);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initial) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await financeRepository.getDashboard({});
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initial]);

  if (loading) {
    return (
      <div className='space-y-4'>
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className='trade-card h-36 animate-pulse border p-5' />
          ))}
        </div>
        <Card className='trade-card h-72 animate-pulse border' />
      </div>
    );
  }

  if (error) {
    return (
      <Card className='trade-card border'>
        <CardContent className='flex flex-col items-center gap-3 py-10 text-center'>
          <p className='font-medium'>Unable to load analytics</p>
          <p className='trade-secondary max-w-md text-sm'>{error}</p>
          <p className='trade-secondary text-xs'>
            Make sure the backend services are running, then refresh.
          </p>
          <Button onClick={load}>
            <RefreshCw className='size-4' /> Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className='trade-card border'>
        <CardContent className='py-10 text-center'>
          <p className='text-sm'>No financial data yet. Upload a document to get started.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <p className='trade-secondary text-xs'>
          Period: {data.period_from} → {data.period_to}
        </p>
        <Button variant='outline' size='sm' onClick={load}>
          <RefreshCw className='size-3' /> Refresh
        </Button>
      </div>

      <FinancialSummaryCards data={data} />

      <div className='grid gap-4 lg:grid-cols-3'>
        <MonthlyPerformance data={data} />
        <ExpenseBreakdown data={data} />
        <TradingPanel data={data} />
      </div>
    </div>
  );
}
