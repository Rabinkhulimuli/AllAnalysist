import { NextRequest, NextResponse } from 'next/server';

import { BACKEND_CONFIG } from '@/src/infrastructure/finance/backend';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await context.params;
  try {
    const res = await fetch(`${BACKEND_CONFIG.document}/api/v1/documents/${documentId}/status`, {
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
