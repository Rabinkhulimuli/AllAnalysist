import { ImageResponse } from 'next/og';

export const alt = 'Financial Analytics - Understand Your Money';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: '#0f172a',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'center',
        padding: '80px',
        width: '100%',
      }}
    >
      <div style={{ color: '#38bdf8', display: 'flex', fontSize: 28, fontWeight: 700 }}>
        FINANCIAL ANALYTICS
      </div>
      <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, marginTop: 24 }}>
        Understand your money.
      </div>
      <div style={{ color: '#cbd5e1', display: 'flex', fontSize: 30, marginTop: 24 }}>
        Turn financial documents into clear insights.
      </div>
    </div>,
    { ...size }
  );
}
