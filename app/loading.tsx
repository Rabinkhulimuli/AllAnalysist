'use client';

import { Button } from '@base-ui/react';
import { SplinePointer } from 'lucide-react';

export default function Loading() {
  return (
    <div className='flex min-h-[100dvh] items-center justify-center bg-linear-to-br from-[#2a5690] via-[#2596be] to-[#2596be]'>
      <div className='flex flex-col items-center gap-4'>
        {/* Spinner */}
        <div className='border-muted border-t-primary h-12 w-12 animate-spin rounded-full border-4' />
      </div>
      {/* Text */}
      <Button disabled>
        <SplinePointer />
        Loading...
      </Button>
    </div>
  );
}
