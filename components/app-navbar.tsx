'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  Menu,
  PanelsTopLeft,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Overview', icon: PanelsTopLeft },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/trader', label: 'Trader', icon: BarChart3 },
  { href: '/transactions', label: 'Transactions', icon: ClipboardList },
];

function isActivePath(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

export function AppNavbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className='sticky top-0 z-50 border-b border-[var(--trade-border)] bg-[color:var(--trade-card)]/95 backdrop-blur'>
      <div className='mx-auto flex min-h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8'>
        <Link
          href='/'
          className='flex shrink-0 items-center gap-2.5 text-[var(--trade-text)]'
          onClick={() => setIsMenuOpen(false)}
        >
          <span className='flex size-9 items-center justify-center rounded-lg bg-[var(--trade-accent)] text-white shadow-sm'>
            <BarChart3 className='size-5' aria-hidden='true' />
          </span>
          <span className='text-base font-bold tracking-tight'>AllAnalysist</span>
        </Link>

        <nav aria-label='Main navigation' className='hidden flex-1 items-center gap-1 md:flex'>
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = isActivePath(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--trade-elevated)] text-[var(--trade-accent)]'
                    : 'text-[var(--trade-secondary)] hover:bg-[var(--trade-elevated)] hover:text-[var(--trade-text)]'
                }`}
              >
                <Icon className='size-4' aria-hidden='true' />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className='ml-auto hidden items-center gap-2 md:flex'>
          <Link
            href='/auth/login'
            className='rounded-md px-3 py-2 text-sm font-semibold text-[var(--trade-secondary)] transition-colors hover:bg-[var(--trade-elevated)] hover:text-[var(--trade-text)]'
          >
            Sign in
          </Link>
          <Link
            href='/auth/register'
            className='inline-flex items-center gap-1.5 rounded-md bg-[var(--trade-accent)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:brightness-95'
          >
            Get started
            <ChevronDown className='size-3.5 -rotate-90' aria-hidden='true' />
          </Link>
        </div>

        <button
          type='button'
          aria-expanded={isMenuOpen}
          aria-controls='mobile-navigation'
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className='ml-auto inline-flex size-10 items-center justify-center rounded-md text-[var(--trade-text)] transition-colors hover:bg-[var(--trade-elevated)] md:hidden'
          onClick={() => setIsMenuOpen(open => !open)}
        >
          {isMenuOpen ? <X className='size-5' /> : <Menu className='size-5' />}
        </button>
      </div>

      {isMenuOpen && (
        <div
          id='mobile-navigation'
          className='border-t border-[var(--trade-border)] px-4 pt-2 pb-4 md:hidden'
        >
          <nav aria-label='Mobile navigation' className='grid gap-1'>
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = isActivePath(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-[var(--trade-elevated)] text-[var(--trade-accent)]'
                      : 'text-[var(--trade-secondary)] hover:bg-[var(--trade-elevated)]'
                  }`}
                >
                  <Icon className='size-4' aria-hidden='true' />
                  {label}
                </Link>
              );
            })}
            <div className='mt-2 grid grid-cols-2 gap-2 border-t border-[var(--trade-border)] pt-3'>
              <Link
                href='/auth/login'
                onClick={() => setIsMenuOpen(false)}
                className='rounded-md border border-[var(--trade-border)] px-3 py-2 text-center text-sm font-semibold text-[var(--trade-text)]'
              >
                Sign in
              </Link>
              <Link
                href='/auth/register'
                onClick={() => setIsMenuOpen(false)}
                className='rounded-md bg-[var(--trade-accent)] px-3 py-2 text-center text-sm font-semibold text-white'
              >
                Get started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
