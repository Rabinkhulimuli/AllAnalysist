import { NextRequest, NextResponse } from 'next/server';

import { BACKEND_CONFIG } from '@/src/infrastructure/finance/backend';

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const target = new URLSearchParams();
  // forward whitelisted query params to the backend
  for (const key of ['from', 'to', 'transaction_type', 'category', 'asset', 'offset', 'limit']) {
    const value = params.get(key);
    if (value) target.set(key, value);
  }
  const qs = target.toString();

  try {
    const res = await fetch(
      `${BACKEND_CONFIG.transaction}/api/v1/transactions${qs ? `?${qs}` : ''}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
