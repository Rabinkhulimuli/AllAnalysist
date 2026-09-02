import { ArrowDownRight, ArrowUpRight, Boxes, Coins, TrendingUp, Wallet } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  currency,
  Product,
  summarize,
} from '@/src/presentation/features/TradeDetail/constants/trade';

type Props = { list: Product[] };

export function SummaryCards({ list }: Props) {
  const s = summarize(list);

  const cards = [
    {
      label: 'Revenue',
      value: currency(s.revenue),
      hint: `${s.unitsSold.toLocaleString()} units sold`,
      delta: 12.4,
      icon: Coins,
    },
    {
      label: 'Cost of goods',
      value: currency(s.cost),
      hint: `${s.unitsBought.toLocaleString()} units bought`,
      delta: 6.1,
      icon: Wallet,
    },
    {
      label: s.profit >= 0 ? 'Net profit' : 'Net loss',
      value: currency(Math.abs(s.profit)),
      hint: `${s.margin.toFixed(1)}% margin`,
      delta: 9.8,
      icon: TrendingUp,
      accent: true,
    },
    {
      label: 'Inventory on hand',
      value: currency(s.inventoryValue),
      hint: `${s.sellThrough.toFixed(0)}% sell-through`,
      delta: -3.2,
      icon: Boxes,
    },
  ];

  return (
    <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
      {cards.map(c => {
        const Icon = c.icon;
        const up = c.delta >= 0;
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
              {Math.abs(c.delta)}% vs last quarter
            </div>
          </Card>
        );
      })}
    </div>
  );
}
