// Server-side backend service endpoints. These run in Next.js Route Handlers
// (server components), so the env vars are not exposed to the client bundle.

export const BACKEND_CONFIG = {
  analytics: process.env.ANALYTICS_SERVICE_URL ?? 'http://localhost:8004',
  transaction: process.env.TRANSACTION_SERVICE_URL ?? 'http://localhost:8002',
  document: process.env.DOCUMENT_SERVICE_URL ?? 'http://localhost:8000',
  extraction: process.env.EXTRACTION_SERVICE_URL ?? 'http://localhost:8003',
} as const;
