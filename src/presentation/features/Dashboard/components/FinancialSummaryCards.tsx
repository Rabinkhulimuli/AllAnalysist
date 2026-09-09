'use client';
import { ArrowDownRight, ArrowUpRight, Coins, TrendingUp, Wallet, LineChart } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { DashboardSummary } from '@/src/domain/finance/Analytics';
import { formatMoney } from '@/src/presentation/features/Dashboard/format';

type Props = { data: DashboardSummary };

export function FinancialSummaryCards({ data }: Props) {
  const profitPositive = Number(data.net_profit.amount) >= 0;

  const cards = [
    {
      label: 'Total Income',
      value: formatMoney(data.income),
      hint: `Period income`,
      icon: Coins,
    },
    {
      label: 'Total Expenses',
      value: formatMoney(data.expenses),
      hint: `${data.expenses_by_category.length} categories`,
      icon: Wallet,
    },
    {
      label: profitPositive ? 'Net Profit' : 'Net Loss',
      value: formatMoney(data.net_profit),
      hint: 'Income + trading gains − expenses',
      accent: true,
      icon: TrendingUp,
    },
    {
      label: 'Trading Gains',
      value: formatMoney(data.trading_gain),
      hint: `${formatMoney(data.trading.realized_gain)} realized`,
      icon: LineChart,
    },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map(c => {
        const Icon = c.icon;
        const up = profitPositive;
        return (
          <Card
            key={c.label}
            className={cn(
              'trade-card relative overflow-hidden border p-5 shadow-sm transition-shadow hover:shadow-md',
              c.accent && 'trade-elevated trade-accent'
            )}
          >
            <div className='flex items-start justify-between gap-3'>
              <div className='space-y-1'>
                <p
                  className={cn(
                    'text-xs font-medium tracking-wider uppercase',
                    c.accent ? 'text-trade-accent/70' : 'trade-secondary'
                  )}
                >
                  {c.label}
                </p>
                <p className='text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl'>
                  {c.value}
                </p>
                <p className={cn('text-xs', c.accent ? 'text-trade-accent/70' : 'trade-secondary')}>
                  {c.hint}
                </p>
              </div>
              <span
                className={cn(
                  'rounded-lg p-2',
                  c.accent ? 'bg-trade-accent/15' : 'trade-elevated trade-text'
                )}
              >
                <Icon className='size-4' />
              </span>
            </div>
            <div
              className={cn(
                'mt-4 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
                c.accent
                  ? 'bg-trade-accent/15'
                  : up
                    ? 'bg-trade-buy/10 trade-buy'
                    : 'bg-trade-sell/10 trade-sell'
              )}
            >
              {up ? <ArrowUpRight className='size-3' /> : <ArrowDownRight className='size-3' />}
              {up ? 'Profitable period' : 'Loss period'}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
