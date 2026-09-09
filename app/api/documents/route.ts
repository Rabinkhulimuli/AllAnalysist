import { NextRequest, NextResponse } from 'next/server';

import { BACKEND_CONFIG } from '@/src/infrastructure/finance/backend';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND_CONFIG.document}/api/v1/documents`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}

export async function POST(request: NextRequest) {
  // Forward the multipart/form-data upload to document-service.
  const formData = await request.formData();

  try {
    const res = await fetch(`${BACKEND_CONFIG.document}/api/v1/documents`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 502 });
  }
}
