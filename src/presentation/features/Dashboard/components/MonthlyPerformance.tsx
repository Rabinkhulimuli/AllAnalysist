'use client';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSummary } from '@/src/domain/finance/Analytics';
import {
  formatCompact,
  formatMoney,
  monthLabel,
} from '@/src/presentation/features/Dashboard/format';

const tooltipStyle = {
  backgroundColor: 'var(--trade-elevated)',
  border: '1px solid var(--trade-border)',
  borderRadius: '0.5rem',
  color: 'var(--trade-text)',
  fontSize: 12,
};

export function MonthlyPerformance({ data }: { data: DashboardSummary }) {
  const series = data.monthly.map(m => ({
    month: monthLabel(m.month),
    income: Number(m.income.amount),
    expenses: Number(m.expenses.amount),
    net_profit: Number(m.net_profit.amount),
    gain: m.trading ? Number(m.trading.realized_gain.amount) : 0,
  }));

  return (
    <Card className='lg:col-span-2'>
      <CardHeader>
        <CardTitle className='text-base'>Monthly performance</CardTitle>
        <CardDescription>Income, expenses and net profit by month</CardDescription>
      </CardHeader>
      <CardContent className='h-72'>
        {series.length === 0 ? (
          <div className='trade-secondary flex h-full items-center justify-center text-sm'>
            No data for the selected period.
          </div>
        ) : (
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={series} margin={{ left: -12, right: 8, top: 4 }}>
              <defs>
                <linearGradient id='incomeFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='var(--trade-buy)' stopOpacity={0.45} />
                  <stop offset='100%' stopColor='var(--trade-buy)' stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--trade-border)' vertical={false} />
              <XAxis
                dataKey='month'
                stroke='var(--trade-secondary)'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke='var(--trade-secondary)'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => formatCompact(v)}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={v => formatMoney({ amount: String(v ?? 0), currency: 'NPR' })}
                cursor={{ stroke: 'var(--trade-border)' }}
              />
              <Area
                type='monotone'
                dataKey='income'
                name='Income'
                stroke='var(--trade-buy)'
                strokeWidth={2}
                fill='url(#incomeFill)'
              />
              <Area
                type='monotone'
                dataKey='expenses'
                name='Expenses'
                stroke='var(--trade-sell)'
                strokeWidth={2}
                fill='transparent'
              />
              <Area
                type='monotone'
                dataKey='net_profit'
                name='Net profit'
                stroke='var(--trade-accent)'
                strokeWidth={2}
                fill='transparent'
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
