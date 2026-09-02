'use client';
import { useMemo, useState } from 'react';
import { Activity, Download, LineChart, Moon, Sun, UploadCloud } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toaster } from '@/components/ui/sonner';
import { CATEGORIES, products } from '@/src/presentation/features/TradeDetail/constants/trade';
import { SummaryCards } from '@/src/presentation/features/TradeDetail/components/SummeryCards';
import { UploadWorkflow } from '@/src/presentation/features/TradeDetail/components/UploadWorkflow';
import { Charts } from '@/src/presentation/features/TradeDetail/components/chart';
import { ProductTable } from '@/src/presentation/features/TradeDetail/components/ProductTable';

export default function TraderDashboard() {
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [period, setPeriod] = useState('all');
  const { resolvedTheme, setTheme } = useTheme();

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (status !== 'all' && p.status !== status) return false;
      if (period !== 'all') {
        const month = Number(p.purchaseDate.slice(5, 7));
        if (period === 'q2' && !(month >= 4 && month <= 6)) return false;
        if (period === 'q3' && !(month >= 7 && month <= 9)) return false;
        if (period === 'q1' && !(month >= 1 && month <= 3)) return false;
      }
      return true;
    });
  }, [category, status, period]);

  return (
    <div className='trade-shell min-h-screen'>
      <Toaster />

      <header className='trade-border bg-trade-main/85 sticky top-0 z-30 border-b backdrop-blur'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-6'>
          <div className='flex items-center gap-3'>
            <span className='bg-trade-accent text-trade-text grid size-9 place-items-center rounded-lg'>
              <LineChart className='size-5' />
            </span>
            <div>
              <p className='text-sm leading-tight font-semibold'>Ledgerline</p>
              <p className='trade-secondary text-xs'>Product trading &amp; P&amp;L</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='trade-control hidden gap-1 sm:inline-flex'>
              <Activity className='trade-buy size-3' /> Live demo data
            </Badge>
            <Button
              variant='outline'
              size='icon'
              className='trade-control'
              aria-label='Toggle theme'
              title='Toggle theme'
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className='size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
              <Moon className='absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
            </Button>
            <Button variant='outline' size='sm'>
              <Download className='size-4' /> Export
            </Button>
            <Button size='sm'>
              <a href='#upload' className='flex items-center gap-2'>
                <UploadCloud className='size-4' /> Upload documents
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 sm:py-8'>
        <section className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
          <div>
            <h1 className='text-2xl font-semibold tracking-tight sm:text-3xl'>
              Trading performance overview
            </h1>
            <p className='trade-secondary mt-1 text-sm'>
              Every purchase, sale and margin across your catalogue — updated as documents are
              imported.
            </p>
          </div>
          <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:w-auto'>
            <Select value={category} onValueChange={value => value !== null && setCategory(value)}>
              <SelectTrigger className='trade-control w-full sm:w-[160px]'>
                <SelectValue placeholder='Category' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All categories</SelectItem>
                {CATEGORIES.map(c => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={value => value !== null && setStatus(value)}>
              <SelectTrigger className='trade-control w-full sm:w-[160px]'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All statuses</SelectItem>
                <SelectItem value='sold'>Sold out</SelectItem>
                <SelectItem value='partial'>Partially sold</SelectItem>
                <SelectItem value='in-stock'>In stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={period} onValueChange={value => value !== null && setPeriod(value)}>
              <SelectTrigger className='trade-control col-span-2 w-full sm:col-span-1 sm:w-[160px]'>
                <SelectValue placeholder='Period' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All periods</SelectItem>
                <SelectItem value='q1'>Q1 purchases</SelectItem>
                <SelectItem value='q2'>Q2 purchases</SelectItem>
                <SelectItem value='q3'>Q3 purchases</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        <SummaryCards list={filtered} />
        <UploadWorkflow />
        <Charts list={filtered} />
        <ProductTable list={filtered} />

        <footer className='trade-secondary pb-4 text-xs'>
          Figures shown are demo data for illustration.
        </footer>
      </main>
    </div>
  );
}
