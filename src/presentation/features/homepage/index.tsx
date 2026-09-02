import Link from 'next/link';
import React from 'react';

export default function HomePageIndex() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <div className='mx-auto max-w-4xl px-4 py-16'>
        <div className='mb-12 text-center'>
          <h1 className='mb-4 text-5xl font-bold text-gray-900'>Clean Architecture Template</h1>
          <p className='text-xl text-gray-600'>
            A Next.js template following Domain-Driven Design and Clean Architecture principles
          </p>
        </div>

        <div className='mb-12 grid grid-cols-1 gap-8 md:grid-cols-2'>
          <div className='rounded-lg bg-white p-8 shadow-md'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Architecture Layers</h2>
            <ul className='space-y-3 text-gray-700'>
              <li className='flex items-start'>
                <span className='mr-3 font-semibold'>Domain:</span>
                <span>Business entities and rules</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 font-semibold'>Application:</span>
                <span>Use cases and business logic coordination</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 font-semibold'>Infrastructure:</span>
                <span>External services and data access</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 font-semibold'>Presentation:</span>
                <span>UI components and user interactions</span>
              </li>
            </ul>
          </div>

          <div className='rounded-lg bg-white p-8 shadow-md'>
            <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Features Included</h2>
            <ul className='space-y-3 text-gray-700'>
              <li className='flex items-start'>
                <span className='mr-3 font-bold text-green-600'>✓</span>
                <span>Layered architecture structure</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 font-bold text-green-600'>✓</span>
                <span>Domain entities and interfaces</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 font-bold text-green-600'>✓</span>
                <span>Use case implementations</span>
              </li>
              <li className='flex items-start'>
                <span className='mr-3 font-bold text-green-600'>✓</span>
                <span>Example forms and components</span>
              </li>
            </ul>
          </div>
        </div>

        <div className='mb-12 rounded-lg border-2 border-blue-200 bg-blue-50 p-8'>
          <h2 className='mb-4 text-2xl font-semibold text-gray-900'>Directory Structure</h2>
          <pre className='overflow-x-auto rounded bg-white p-4 text-sm text-gray-700'>
            {`src/
├── application/      # Use cases and orchestration
│   ├── auth/
│   ├── inventory/
│   ├── marketplace/
│   ├── payment/
│   └── customer/
├── domain/           # Business entities and interfaces
│   ├── auth/
│   ├── inventory/
│   ├── marketplace/
│   ├── payment/
│   └── customer/
├── infrastructure/   # External services and persistence
│   ├── auth/
│   ├── inventory/
│   ├── marketplace/
│   ├── payment/
│   └── customer/
└── presentation/     # UI components and pages
    ├── features/
    ├── shared/
    ├── components/
    └── providers/`}
          </pre>
        </div>

        <div className='flex justify-center gap-4'>
          <Link
            href='/auth/login'
            className='rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white hover:bg-blue-700'
          >
            View Login Example
          </Link>
          <Link
            href='/auth/register'
            className='rounded-lg bg-green-600 px-8 py-3 font-semibold text-white hover:bg-green-700'
          >
            View Register Example
          </Link>
        </div>

        <div className='mt-12 rounded-lg border border-yellow-200 bg-yellow-50 p-6'>
          <h3 className='mb-2 font-semibold text-gray-900'>Getting Started</h3>
          <p className='mb-2 text-gray-700'>
            This template is structured to scale. Each layer has specific responsibilities:
          </p>
          <ul className='ml-4 space-y-1 text-gray-700'>
            <li>
              • Add your API integrations in{' '}
              <code className='bg-gray-100 px-1'>infrastructure/</code>
            </li>
            <li>
              • Define business logic in <code className='bg-gray-100 px-1'>application/</code>
            </li>
            <li>
              • Build UI components in <code className='bg-gray-100 px-1'>presentation/</code>
            </li>
            <li>• Keep domain models pure and framework-agnostic</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
