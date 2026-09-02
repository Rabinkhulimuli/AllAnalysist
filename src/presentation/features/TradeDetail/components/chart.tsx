import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  currency,
  monthlySeries,
  profitOf,
  revenueOf,
  type Product,
} from '@/src/presentation/features/TradeDetail/constants/trade';

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

export function Charts({ list }: { list: Product[] }) {
  const byCategory = Object.values(
    list.reduce<Record<string, { name: string; revenue: number; profit: number }>>((acc, p) => {
      acc[p.category] ??= { name: p.category, revenue: 0, profit: 0 };
      acc[p.category]!.revenue += revenueOf(p);
      acc[p.category]!.profit += profitOf(p);
      return acc;
    }, {})
  ).sort((a, b) => b.revenue - a.revenue);

  const topProfit = [...list]
    .sort((a, b) => profitOf(b) - profitOf(a))
    .slice(0, 6)
    .map(p => ({ name: p.sku, profit: Math.round(profitOf(p)) }));

  return (
    <div className='grid gap-4 lg:grid-cols-3'>
      <Card className='lg:col-span-2'>
        <CardHeader>
          <CardTitle className='text-base'>Revenue, cost & profit trend</CardTitle>
          <CardDescription>Rolling six-month trading performance</CardDescription>
        </CardHeader>
        <CardContent className='h-72'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart data={monthlySeries} margin={{ left: -12, right: 8, top: 4 }}>
              <defs>
                <linearGradient id='revFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='var(--trade-accent)' stopOpacity={0.45} />
                  <stop offset='100%' stopColor='var(--trade-accent)' stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id='profFill' x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='0%' stopColor='var(--trade-buy)' stopOpacity={0.4} />
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
                tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={v => currency(Number(v ?? 0))}
                cursor={{ stroke: 'var(--trade-border)' }}
              />
              <Legend iconType='circle' wrapperStyle={{ fontSize: 12 }} />
              <Area
                type='monotone'
                dataKey='revenue'
                name='Revenue'
                stroke='var(--trade-accent)'
                strokeWidth={2}
                fill='url(#revFill)'
              />
              <Area
                type='monotone'
                dataKey='profit'
                name='Profit'
                stroke='var(--trade-buy)'
                strokeWidth={2}
                fill='url(#profFill)'
              />
              <Area
                type='monotone'
                dataKey='cost'
                name='Cost'
                stroke='var(--trade-neutral)'
                strokeWidth={1.5}
                strokeDasharray='4 4'
                fill='transparent'
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='text-base'>Revenue by category</CardTitle>
          <CardDescription>Share of total sales</CardDescription>
        </CardHeader>
        <CardContent className='h-72'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey='revenue'
                nameKey='name'
                innerRadius={54}
                outerRadius={84}
                paddingAngle={3}
                stroke='var(--trade-card)'
              >
                {byCategory.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={v => currency(Number(v ?? 0))} />
              <Legend iconType='circle' wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className='lg:col-span-3'>
        <CardHeader>
          <CardTitle className='text-base'>Most profitable SKUs</CardTitle>
          <CardDescription>Gross profit contribution per product</CardDescription>
        </CardHeader>
        <CardContent className='h-64'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={topProfit} margin={{ left: -12, right: 8 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='var(--trade-border)' vertical={false} />
              <XAxis
                dataKey='name'
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
                tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
              />
              <Tooltip contentStyle={tooltipStyle} formatter={v => currency(Number(v ?? 0))} />
              <Bar dataKey='profit' name='Profit' fill='var(--trade-buy)' radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
