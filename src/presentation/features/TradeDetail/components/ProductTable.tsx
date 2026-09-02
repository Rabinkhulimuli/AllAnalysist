'use client';
import { useMemo, useState } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  costOf,
  currency2,
  marginOf,
  profitOf,
  revenueOf,
  type Product,
} from '@/src/presentation/features/TradeDetail/constants/trade';

type SortKey = 'name' | 'revenue' | 'cost' | 'profit' | 'margin';

const statusLabel: Record<Product['status'], string> = {
  sold: 'Sold out',
  partial: 'Partially sold',
  'in-stock': 'In stock',
};

function SortableHeader({
  k,
  label,
  sortKey,
  onToggle,
}: {
  k: SortKey;
  label: string;
  sortKey: SortKey;
  onToggle: (key: SortKey) => void;
}) {
  return (
    <button onClick={() => onToggle(k)} className='hover:trade-text inline-flex items-center gap-1'>
      {label}
      <ArrowUpDown className={cn('size-3', sortKey === k ? 'opacity-100' : 'opacity-40')} />
    </button>
  );
}

export function ProductTable({ list }: { list: Product[] }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('profit');
  const [asc, setAsc] = useState(false);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = list.filter(
      p =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q)
    );
    const value = (p: Product) =>
      sortKey === 'name'
        ? p.name
        : sortKey === 'revenue'
          ? revenueOf(p)
          : sortKey === 'cost'
            ? costOf(p)
            : sortKey === 'margin'
              ? marginOf(p)
              : profitOf(p);
    return [...filtered].sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      if (typeof av === 'string' || typeof bv === 'string')
        return asc ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      return asc ? av - bv : bv - av;
    });
  }, [list, query, sortKey, asc]);

  const toggle = (key: SortKey) => {
    if (key === sortKey) setAsc(v => !v);
    else {
      setSortKey(key);
      setAsc(false);
    }
  };

  return (
    <Card className='trade-card border'>
      <CardHeader className='gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle className='text-base'>Product ledger</CardTitle>
          <CardDescription>
            Purchase, sale and profit detail for {rows.length} product{rows.length === 1 ? '' : 's'}
          </CardDescription>
        </div>
        <div className='relative w-full sm:w-64'>
          <Search className='trade-secondary absolute top-1/2 left-3 size-4 -translate-y-1/2' />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Search product, SKU, supplier'
            className='pl-9'
          />
        </div>
      </CardHeader>
      <CardContent className='px-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                <TableHead className='min-w-[220px]'>
                  <SortableHeader k='name' label='Product' sortKey={sortKey} onToggle={toggle} />
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Bought</TableHead>
                <TableHead className='text-right'>Sold</TableHead>
                <TableHead className='text-right'>Unit cost</TableHead>
                <TableHead className='text-right'>Unit price</TableHead>
                <TableHead className='text-right'>
                  <SortableHeader k='cost' label='Cost' sortKey={sortKey} onToggle={toggle} />
                </TableHead>
                <TableHead className='text-right'>
                  <SortableHeader k='revenue' label='Revenue' sortKey={sortKey} onToggle={toggle} />
                </TableHead>
                <TableHead className='text-right'>
                  <SortableHeader k='profit' label='P&L' sortKey={sortKey} onToggle={toggle} />
                </TableHead>
                <TableHead className='text-right'>
                  <SortableHeader k='margin' label='Margin' sortKey={sortKey} onToggle={toggle} />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={10} className='trade-secondary py-12 text-center text-sm'>
                    No products match your filters.
                  </TableCell>
                </TableRow>
              )}
              {rows.map(p => {
                const pl = profitOf(p);
                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className='font-medium'>{p.name}</div>
                      <div className='trade-secondary text-xs'>
                        {p.sku} · {p.supplier}
                      </div>
                      <div className='trade-secondary text-xs'>
                        Bought {p.purchaseDate}
                        {p.saleDate ? ` · Last sale ${p.saleDate}` : ' · Not yet sold'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant='outline'
                        className={cn(
                          'whitespace-nowrap',
                          p.status === 'sold' && 'border-trade-buy/40 bg-trade-buy/10 trade-buy',
                          p.status === 'partial' &&
                            'border-trade-warning/40 bg-trade-warning/10 trade-warning',
                          p.status === 'in-stock' && 'trade-secondary'
                        )}
                      >
                        {statusLabel[p.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>{p.unitsBought}</TableCell>
                    <TableCell className='text-right tabular-nums'>{p.unitsSold}</TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {currency2(p.unitCost)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {currency2(p.unitPrice)}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {currency2(costOf(p))}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {currency2(revenueOf(p))}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right font-medium tabular-nums',
                        pl >= 0 ? 'trade-buy' : 'trade-sell'
                      )}
                    >
                      {pl >= 0 ? '+' : '−'}
                      {currency2(Math.abs(pl))}
                    </TableCell>
                    <TableCell className='text-right tabular-nums'>
                      {marginOf(p).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
