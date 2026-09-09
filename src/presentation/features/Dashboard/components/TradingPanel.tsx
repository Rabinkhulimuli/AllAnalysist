'use client';
import { ArrowDownRight, ArrowUpRight, LineChart } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardSummary } from '@/src/domain/finance/Analytics';
import { formatMoney } from '@/src/presentation/features/Dashboard/format';
import { cn } from '@/lib/utils';

export function TradingPanel({ data }: { data: DashboardSummary }) {
  const { trading } = data;
  const gainPositive = Number(trading.realized_gain.amount) >= 0;

  const rows = [
    { label: 'Total buys', value: formatMoney(trading.buy_volume) },
    { label: 'Total sells', value: formatMoney(trading.sell_volume) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-base'>
          <LineChart className='trade-accent size-4' /> Trading
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        <div className='space-y-2'>
          {rows.map(r => (
            <div key={r.label} className='flex items-center justify-between text-sm'>
              <span className='trade-secondary'>{r.label}</span>
              <span className='font-medium tabular-nums'>{r.value}</span>
            </div>
          ))}
        </div>
        <div className='trade-elevated trade-accent border-trade-accent/30 rounded-lg border p-4'>
          <div className='flex items-center justify-between'>
            <span className='text-sm'>Realized gain</span>
            <Badge
              variant='outline'
              className={cn(
                'gap-1 border-0',
                gainPositive ? 'bg-trade-buy/10 text-trade-buy' : 'bg-trade-sell/10 text-trade-sell'
              )}
            >
              {gainPositive ? (
                <ArrowUpRight className='size-3' />
              ) : (
                <ArrowDownRight className='size-3' />
              )}
              {formatMoney(trading.realized_gain)}
            </Badge>
          </div>
        </div>
        <p className='trade-secondary text-xs'>
          Realized gains computed with FIFO cost-basis from your trades.
        </p>
      </CardContent>
    </Card>
  );
}
