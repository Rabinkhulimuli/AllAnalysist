import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Geist } from 'next/font/google';
import { cn } from '@/lib/utils';
import { RootProviders } from '@/src/presentation/providers/RootProviders';
import { AppNavbar } from '@/components/app-navbar';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
const siteName = 'Financial Analytics';
const siteTitle = 'Financial Analytics | Understand Your Money';
const siteDescription =
  'Turn your financial documents into clear insights. Upload PDFs, CSVs, and spreadsheets to analyze income, expenses, transactions, profit, loss, gains, and monthly financial activity in one place.';

export const metadata: Metadata = {
  metadataBase: siteUrl,

  title: {
    default: siteTitle,
    template: `%s | ${siteName}`,
  },

  description: siteDescription,

  keywords: [
    'financial analytics',
    'financial management',
    'personal finance',
    'financial insights',
    'expense analysis',
    'income analysis',
    'transaction analysis',
    'profit and loss',
    'financial reports',
    'financial dashboard',
    'expense tracking',
    'financial data analysis',
    'PDF financial analysis',
    'CSV financial analysis',
    'financial document processing',
  ],

  authors: [{ name: 'Finance bot' }],
  creator: 'Finance bot',
  publisher: 'Finance bot',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: siteTitle,
    description: siteDescription,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: siteTitle }],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
    images: ['/opengraph-image'],
  },

  alternates: {
    canonical: siteUrl,
  },

  category: 'finance',
};

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={cn('font-sans', geist.variable)} suppressHydrationWarning>
      <body className='antialiased'>
        <RootProviders>
          <AppNavbar />
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </RootProviders>
      </body>
    </html>
  );
}
