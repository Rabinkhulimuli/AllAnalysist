'use client';
import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { FinancialTransaction, TransactionType } from '@/src/domain/finance/FinancialTransaction';
import { financeRepository } from '@/src/infrastructure/finance/FinanceRepository';
import { formatMoney, typeLabel } from '@/src/presentation/features/Dashboard/format';

const TYPES: TransactionType[] = [
  'income',
  'expense',
  'buy',
  'sell',
  'deposit',
  'withdrawal',
  'transfer',
  'fee',
  'dividend',
  'interest',
  'refund',
  'tax',
];

export default function TransactionsTable() {
  const [items, setItems] = useState<FinancialTransaction[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<string>('all');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await financeRepository.getTransactions({
        transaction_type: type === 'all' ? undefined : type,
        limit: 200,
      });
      setItems(result.items);
      setTotal(result.total);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await financeRepository.getTransactions({
          transaction_type: type === 'all' ? undefined : type,
          limit: 200,
        });
        if (!cancelled) {
          setItems(result.items);
          setTotal(result.total);
        }
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [type]);

  const signed = (t: FinancialTransaction): number => {
    const amount = Number(t.amount ?? 0);
    if (t.transaction_type === 'expense' || t.transaction_type === 'buy') return -Math.abs(amount);
    return amount;
  };

  return (
    <Card className='trade-card border'>
      <CardHeader className='flex flex-row items-center justify-between gap-3'>
        <CardTitle className='text-base'>
          Transactions{' '}
          {total > 0 && <span className='trade-secondary ml-1 text-sm font-normal'>({total})</span>}
        </CardTitle>
        <div className='flex items-center gap-2'>
          <Select value={type} onValueChange={v => v !== null && setType(v)}>
            <SelectTrigger className='trade-control w-[160px]'>
              <SelectValue placeholder='Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>All types</SelectItem>
              {TYPES.map(t => (
                <SelectItem key={t} value={t}>
                  {typeLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant='outline' size='icon' aria-label='Refresh' onClick={load}>
            <RefreshCw className='size-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error ? (
          <p className='trade-secondary py-6 text-center text-sm'>{error}</p>
        ) : loading ? (
          <p className='trade-secondary py-6 text-center text-sm'>Loading…</p>
        ) : items.length === 0 ? (
          <p className='trade-secondary py-6 text-center text-sm'>
            No transactions found. Upload documents to populate your ledger.
          </p>
        ) : (
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                  <TableHead>Currency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map(t => {
                  const amount = signed(t);
                  const positive = amount >= 0;
                  return (
                    <TableRow key={t.id}>
                      <TableCell className='whitespace-nowrap'>{t.date ?? '—'}</TableCell>
                      <TableCell>
                        {t.transaction_type && (
                          <Badge
                            variant='outline'
                            className={cn(
                              positive
                                ? 'border-trade-buy/40 bg-trade-buy/10 text-trade-buy'
                                : 'border-trade-sell/40 bg-trade-sell/10 text-trade-sell'
                            )}
                          >
                            {typeLabel(t.transaction_type)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className='max-w-[220px] truncate'>{t.merchant || '—'}</TableCell>
                      <TableCell className='trade-secondary'>{t.category ?? '—'}</TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-medium tabular-nums',
                          positive ? 'trade-buy' : 'trade-sell'
                        )}
                      >
                        {t.amount !== null
                          ? formatMoney({
                              amount: String(Math.abs(amount)),
                              currency: t.currency ?? 'NPR',
                            })
                          : '—'}
                      </TableCell>
                      <TableCell className='trade-secondary'>{t.currency ?? '—'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
