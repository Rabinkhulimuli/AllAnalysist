import { NextRequest, NextResponse } from 'next/server';

import { BACKEND_CONFIG } from '@/src/infrastructure/finance/backend';

export async function GET(request: NextRequest) {
  const from = request.nextUrl.searchParams.get('from');
  const to = request.nextUrl.searchParams.get('to');
  const params = new URLSearchParams();
  if (from) params.set('from', from);
  if (to) params.set('to', to);
  const qs = params.toString();

  try {
    const res = await fetch(
      `${BACKEND_CONFIG.analytics}/api/v1/analytics/expenses${qs ? `?${qs}` : ''}`,
      { cache: 'no-store' }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
