'use client';
import { useRef, useState } from 'react';
import {
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  UploadCloud,
  X,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  DocumentStatusValue,
  documentPipelineService,
} from '@/src/infrastructure/finance/DocumentPipelineService';

type Stage = 'idle' | 'uploading' | 'processing' | 'results' | 'error';

type Picked = { file: File; id?: string; name: string; size: number; kind: string };

const ACCEPT =
  '.pdf,.doc,.docx,.csv,.xls,.xlsx,.png,.jpg,.jpeg,.webp,application/pdf,text/csv,image/*';

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
  return FileText;
}

const formatSize = (bytes: number) =>
  bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;

const POLL_INTERVAL_MS = 1200;
const MAX_POLL_ATTEMPTS = 120;

const STEPS = [
  'Uploading file',
  'Detecting document type',
  'Extracting & classifying transactions',
  'Posting to the financial ledger',
];

export function UploadWorkflow({ onImported }: { onImported?: () => void }) {
  const [stage, setStage] = useState<Stage>('idle');
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<Picked[]>([]);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const poll = (getId: () => string | undefined) => {
    let attempts = 0;
    const id = window.setInterval(async () => {
      const documentId = getId();
      if (!documentId) {
        window.clearInterval(id);
        return;
      }
      attempts += 1;
      try {
        const doc = await documentPipelineService.getDocument(documentId);
        setFiles(prev => prev.map(p => (p.id === documentId ? { ...p, id: documentId } : p)));
        const status: DocumentStatusValue = doc.status;
        if (status === 'COMPLETED') {
          window.clearInterval(id);
          setProgress(100);
          setStage('results');
          toast.success('Document processed', {
            description: 'Transactions were extracted and posted to your ledger.',
          });
          onImported?.();
          return;
        }
        if (status === 'FAILED') {
          window.clearInterval(id);
          setError(doc.error_message || 'Document processing failed.');
          setStage('error');
          toast.error('Processing failed', { description: error });
          return;
        }
        setProgress(Math.min(96, 10 + (attempts % 80)));
      } catch {
        if (attempts >= 3) {
          window.clearInterval(id);
          setError('Could not check document status. The backend may be unavailable.');
          setStage('error');
          toast.error('Status check failed');
          return;
        }
      }
      if (attempts >= MAX_POLL_ATTEMPTS) {
        window.clearInterval(id);
        setError('Processing is taking longer than expected. Try again later.');
        setStage('error');
      }
    }, POLL_INTERVAL_MS);
  };

  const accept = async (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const picked = Array.from(list).map(f => ({
      file: f,
      id: undefined as string | undefined,
      name: f.name,
      size: f.size,
      kind: kindOf(f.name),
    }));
    setFiles(picked);
    setError(null);
    setStage('uploading');
    setProgress(0);

    try {
      for (let i = 0; i < picked.length; i++) {
        const uploaded = await documentPipelineService.uploadFile(picked[i].file);
        setFiles(prev =>
          prev.map(p => (p.name === uploaded.filename ? { ...p, id: uploaded.id } : p))
        );
        setProgress(Math.round(((i + 1) / picked.length) * 100));
        poll(() => uploaded.id);
      }
      setStage('processing');
    } catch (e) {
      setError((e as Error).message);
      setStage('error');
    }
  };

  const reset = () => {
    setFiles([]);
    setStage('idle');
    setProgress(0);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Card id='upload' className='trade-card border-trade-accent/30'>
      <CardHeader className='gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle className='flex items-center gap-2 text-base'>
            <Sparkles className='trade-accent size-4' />
            Import financial documents
          </CardTitle>
          <CardDescription>
            Drop bank statements, trading histories, invoices or receipts — we extract and import
            them automatically.
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
                void accept(e.dataTransfer.files);
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
              onChange={e => void accept(e.target.files)}
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
              <div className='space-y-2'>
                <div className='trade-secondary flex justify-between text-xs'>
                  <span>Processing document…</span>
                  <span className='tabular-nums'>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
                <ol className='mt-3 space-y-3'>
                  {STEPS.map((label, i) => (
                    <li key={label} className='flex items-center gap-3 text-sm'>
                      {i < 1 ? (
                        <CheckCircle2 className='trade-buy size-4' />
                      ) : i === 1 ? (
                        <Loader2 className='trade-accent size-4 animate-spin' />
                      ) : (
                        <span className='trade-border size-4 rounded-full border' />
                      )}
                      <span className={cn(i > 1 && 'trade-secondary')}>{label}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {stage === 'results' && (
          <div className='space-y-5'>
            <div className='border-trade-buy/30 bg-trade-buy/10 flex items-center gap-3 rounded-xl border p-4'>
              <CheckCircle2 className='trade-buy size-5' />
              <div>
                <p className='font-medium'>Done</p>
                <p className='trade-secondary text-sm'>
                  {files.length} document{files.length > 1 ? 's' : ''} processed. Transactions are
                  in your ledger.
                </p>
              </div>
            </div>
            <Button variant='outline' onClick={reset}>
              Upload more files
            </Button>
          </div>
        )}

        {stage === 'error' && (
          <div className='space-y-4'>
            <p className='trade-sell text-sm'>{error}</p>
            <div className='flex flex-wrap gap-2'>
              <Button onClick={reset}>Try again</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
