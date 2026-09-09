'use client';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSummary } from '@/src/domain/finance/Analytics';
import { formatMoney } from '@/src/presentation/features/Dashboard/format';

const PIE_COLORS = [
  'var(--trade-accent)',
  'var(--trade-buy)',
  'var(--trade-warning)',
  'var(--trade-neutral)',
  'var(--trade-sell)',
];

const tooltipStyle = {
  backgroundColor: 'var(--trade-elevated)',
  border: '1px solid var(--trade-border)',
  borderRadius: '0.5rem',
  color: 'var(--trade-text)',
  fontSize: 12,
};

export function ExpenseBreakdown({ data }: { data: DashboardSummary }) {
  const rows = data.expenses_by_category.map(c => ({
    name: c.category,
    value: Number(c.amount.amount),
    currency: c.amount.currency,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-base'>Expenses by category</CardTitle>
        <CardDescription>Share of total spend</CardDescription>
      </CardHeader>
      <CardContent className='h-72'>
        {rows.length === 0 ? (
          <div className='trade-secondary flex h-full items-center justify-center text-sm'>
            No expenses recorded.
          </div>
        ) : (
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={rows}
                dataKey='value'
                nameKey='name'
                innerRadius={54}
                outerRadius={84}
                paddingAngle={3}
                stroke='var(--trade-card)'
              >
                {rows.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v, name, entry) =>
                  formatMoney({
                    amount: String(entry.payload.value ?? 0),
                    currency: entry.payload.currency,
                  })
                }
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
