'use client';
import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  Table as TableIcon,
  UploadCloud,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { currency2, extractedRows } from '@/src/presentation/features/TradeDetail/constants/trade';

type Stage = 'idle' | 'uploading' | 'processing' | 'results';

type Picked = { name: string; size: number; kind: string };

const ACCEPT =
  '.pdf,.doc,.docx,.csv,.xls,.xlsx,.png,.jpg,.jpeg,.webp,application/pdf,text/csv,image/*';

const STEPS = [
  'Uploading & virus scan',
  'Detecting document type',
  'OCR & table extraction',
  'Matching SKUs to ledger',
  'Calculating cost, revenue & P&L',
];

function kindOf(name: string) {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (['pdf'].includes(ext)) return 'PDF';
  if (['doc', 'docx'].includes(ext)) return 'Word';
  if (['csv', 'xls', 'xlsx'].includes(ext)) return 'Spreadsheet';
  if (['png', 'jpg', 'jpeg', 'webp', 'heic'].includes(ext)) return 'Image';
  return 'Document';
}

function iconFor(kind: string) {
  if (kind === 'Spreadsheet') return FileSpreadsheet;
  if (kind === 'Image') return ImageIcon;
  if (kind === 'Word') return FileText;
  return FileText;
}

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

export function UploadWorkflow() {
  const [stage, setStage] = useState<Stage>('idle');
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<Picked[]>([]);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage !== 'uploading') return;
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) return 100;
        return Math.min(100, p + 8 + Math.random() * 10);
      });
    }, 140);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'uploading' || progress < 100) return undefined;
    const t = setTimeout(() => {
      setStage('processing');
      setStep(0);
    }, 350);
    return () => clearTimeout(t);
  }, [stage, progress]);

  useEffect(() => {
    if (stage !== 'processing') return;
    if (step >= STEPS.length) {
      const t = setTimeout(() => {
        setStage('results');
        toast.success(`${extractedRows.length} transactions extracted`, {
          description: 'Review and import them into your ledger.',
        });
      }, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStep(s => s + 1), 700);
    return () => clearTimeout(t);
  }, [stage, step]);

  const accept = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const picked = Array.from(list).map(f => ({
      name: f.name,
      size: f.size,
      kind: kindOf(f.name),
    }));
    setFiles(picked);
    setProgress(0);
    setStage('uploading');
  };

  const reset = () => {
    setFiles([]);
    setStage('idle');
    setProgress(0);
    setStep(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  const totals = extractedRows.reduce(
    (acc, r) => {
      const amount = r.units * r.unitValue;
      if (r.type === 'Sale') acc.revenue += amount;
      else acc.cost += amount;
      return acc;
    },
    { revenue: 0, cost: 0 }
  );

  return (
    <Card id='upload' className='trade-card border-trade-accent/30'>
      <CardHeader className='gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Sparkles className='trade-accent size-4' />
            Import trading documents
          </CardTitle>
          <CardDescription>
            Drop invoices, contracts, sales exports or shelf photos — we extract the transactions
            for you.
          </CardDescription>
        </div>
        {stage !== 'idle' && (
          <Button variant='ghost' size='sm' onClick={reset}>
            <X className='size-4' /> Start over
          </Button>
        )}
      </CardHeader>

      <CardContent className='space-y-5'>
        {stage === 'idle' && (
          <>
            <div
              role='button'
              tabIndex={0}
              onClick={() => inputRef.current?.click()}
              onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
              onDragOver={e => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault();
                setDragging(false);
                accept(e.dataTransfer.files);
              }}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
                dragging
                  ? 'border-trade-accent bg-trade-accent/5'
                  : 'trade-border bg-trade-card hover:border-trade-accent/50'
              )}
            >
              <span className='bg-trade-accent/10 trade-accent rounded-full p-3'>
                <UploadCloud className='size-7' />
              </span>
              <p className='mt-4 text-base font-semibold'>Drag & drop files here</p>
              <p className='trade-secondary mt-1 text-sm'>
                or click to browse — up to 20 files, 25 MB each
              </p>
              <Button className='mt-5' size='lg'>
                <UploadCloud className='size-4' /> Select files
              </Button>
              <div className='mt-5 flex flex-wrap justify-center gap-2'>
                {['PDF', 'Word (.doc/.docx)', 'Images (JPG/PNG)', 'CSV', 'Excel (.xls/.xlsx)'].map(
                  t => (
                    <Badge key={t} variant='secondary' className='font-normal'>
                      {t}
                    </Badge>
                  )
                )}
              </div>
            </div>
            <input
              ref={inputRef}
              type='file'
              multiple
              accept={ACCEPT}
              className='hidden'
              onChange={e => accept(e.target.files)}
            />
          </>
        )}

        {(stage === 'uploading' || stage === 'processing') && (
          <div className='trade-elevated space-y-5 rounded-xl border p-5'>
            <div className='space-y-3'>
              {files.map(f => {
                const Icon = iconFor(f.kind);
                return (
                  <div key={f.name} className='flex items-center gap-3 text-sm'>
                    <span className='trade-card border-trade-border rounded-md border p-2'>
                      <Icon className='size-4' />
                    </span>
                    <div className='min-w-0 flex-1'>
                      <p className='truncate font-medium'>{f.name}</p>
                      <p className='trade-secondary text-xs'>
                        {f.kind} · {formatSize(f.size)}
                      </p>
                    </div>
                    {stage === 'uploading' ? (
                      <Loader2 className='trade-secondary size-4 animate-spin' />
                    ) : (
                      <CheckCircle2 className='trade-buy size-4' />
                    )}
                  </div>
                );
              })}
            </div>

            {stage === 'uploading' ? (
              <div className='space-y-2'>
                <div className='trade-secondary flex justify-between text-xs'>
                  <span>Uploading securely…</span>
                  <span className='tabular-nums'>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            ) : (
              <ol className='space-y-3'>
                {STEPS.map((label, i) => (
                  <li key={label} className='flex items-center gap-3 text-sm'>
                    {i < step ? (
                      <CheckCircle2 className='trade-buy size-4' />
                    ) : i === step ? (
                      <Loader2 className='trade-accent size-4 animate-spin' />
                    ) : (
                      <span className='trade-border size-4 rounded-full border' />
                    )}
                    <span className={cn(i > step && 'trade-secondary')}>{label}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        {stage === 'results' && (
          <div className='space-y-5'>
            <div className='grid gap-3 sm:grid-cols-4'>
              {[
                { label: 'Documents processed', value: String(files.length) },
                { label: 'Transactions found', value: String(extractedRows.length) },
                { label: 'Purchases detected', value: currency2(totals.cost) },
                { label: 'Sales detected', value: currency2(totals.revenue) },
              ].map(s => (
                <div key={s.label} className='trade-elevated rounded-lg border p-4'>
                  <p className='trade-secondary text-xs tracking-wider uppercase'>{s.label}</p>
                  <p className='mt-1 text-lg font-semibold tabular-nums'>{s.value}</p>
                </div>
              ))}
            </div>

            <div className='trade-elevated rounded-xl border'>
              <div className='trade-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3'>
                <div className='flex items-center gap-2 text-sm font-medium'>
                  <TableIcon className='trade-accent size-4' /> Extracted transactions
                </div>
                <Badge variant='outline' className='border-trade-buy/40 bg-trade-buy/10 trade-buy'>
                  Ready to import
                </Badge>
              </div>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                      <TableHead className='min-w-[200px]'>Product</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className='text-right'>Units</TableHead>
                      <TableHead className='text-right'>Unit value</TableHead>
                      <TableHead className='text-right'>Amount</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className='text-right'>Confidence</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extractedRows.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className='font-medium'>{r.product}</div>
                          <div className='trade-secondary text-xs'>{r.sku}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant='outline'
                            className={cn(
                              r.type === 'Sale'
                                ? 'border-trade-buy/40 bg-trade-buy/10 trade-buy'
                                : 'border-trade-accent/30 bg-trade-accent/10 trade-accent'
                            )}
                          >
                            {r.type}
                          </Badge>
                        </TableCell>
                        <TableCell className='whitespace-nowrap'>{r.date}</TableCell>
                        <TableCell className='text-right tabular-nums'>{r.units}</TableCell>
                        <TableCell className='text-right tabular-nums'>
                          {currency2(r.unitValue)}
                        </TableCell>
                        <TableCell className='text-right font-medium tabular-nums'>
                          {currency2(r.units * r.unitValue)}
                        </TableCell>
                        <TableCell className='trade-secondary max-w-[180px] truncate text-xs'>
                          {r.document}
                        </TableCell>
                        <TableCell className='text-right'>
                          <span
                            className={cn(
                              'tabular-nums',
                              r.confidence < 0.85 ? 'trade-warning' : 'trade-secondary'
                            )}
                          >
                            {(r.confidence * 100).toFixed(0)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className='flex flex-wrap gap-2'>
              <Button
                onClick={() =>
                  toast.success('Imported into ledger', {
                    description: `${extractedRows.length} transactions posted to your product ledger.`,
                  })
                }
              >
                <CheckCircle2 className='size-4' /> Import all transactions
              </Button>
              <Button variant='outline' onClick={reset}>
                Upload more files
              </Button>
            </div>
            <p className='trade-secondary text-xs'>
              Rows below 85% confidence are flagged for manual review before posting.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
