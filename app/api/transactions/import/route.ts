import { NextRequest, NextResponse } from 'next/server';

import { BACKEND_CONFIG } from '@/src/infrastructure/finance/backend';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const res = await fetch(`${BACKEND_CONFIG.transaction}/api/v1/transactions/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
