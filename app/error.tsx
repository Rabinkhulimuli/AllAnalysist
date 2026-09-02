'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='bg-background flex min-h-[100dvh] items-center justify-center'>
      <div className='max-w-md space-y-4 text-center'>
        <h2 className='text-destructive text-2xl font-semibold'>Something went wrong!</h2>

        <p className='text-muted-foreground text-sm'>
          An unexpected error occurred. Please try again.
        </p>

        <button
          onClick={() => reset()}
          className='text-primary-foreground cursor-pointer rounded-md bg-green-800 px-4 py-2 text-sm font-semibold hover:opacity-90'
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
