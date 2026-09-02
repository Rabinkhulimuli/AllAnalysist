'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MoveLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className='flex items-center'>
      <div className='bg-background flex min-h-[100dvh] w-full flex-col items-center justify-center border-2 px-6 py-12 text-center'>
        {/* Big 404 */}
        <h1 className='text-app-neutral-100 text-9xl font-extrabold tracking-tight'>404</h1>

        <h2 className='mt-6 text-3xl font-bold dark:text-gray-100'>Page Not Found</h2>
        <p className='text-fade mt-2 max-w-md text-sm dark:text-gray-400'>
          Oops! The page you are looking for doesn’t exist or has been moved.
        </p>

        {/* Actions */}
        <div className='mt-8 flex flex-col gap-4 sm:flex-row'>
          <Button className='flex items-center gap-2'>
            <Link href='/'>
              <MoveLeft className='h-4 w-4' />
              Go Back Home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
