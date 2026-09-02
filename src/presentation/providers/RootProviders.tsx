'use client';

import { ReactNode } from 'react';

interface RootProvidersProps {
  children: ReactNode;
}

/**
 * Root Providers Component
 * Wraps the entire application with necessary context providers
 * Add global state management, theme providers, etc. here
 */
export function RootProviders({ children }: RootProvidersProps) {
  return (
    <>
      {/* TODO: Add providers like:
        - ThemeProvider
        - QueryClientProvider
        - AuthContext
        - etc.
      */}
      {children}
    </>
  );
}
