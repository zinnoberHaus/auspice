import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Auspice — A little perspective. A deeper connection.';
export default async function Image() {
  const font = await readFile(join(process.cwd(), 'public/fonts/Libre-Caslon-Display-Regular.ttf'));
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', background: '#F3EEE4', color: '#1D1B17', display: 'flex', flexDirection: 'column', padding: '58px 72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, borderBottom: '1px solid #D8CFBE', paddingBottom: 28 }}>
        <svg width="54" height="54" viewBox="0 0 192 192"><rect width="192" height="192" rx="24" fill="#B3361F"/><path d="M96 37V91M46 58H146M58 91H134M59 115H133V155H59Z" fill="none" stroke="#F6F1E7" strokeWidth="10"/></svg>
        <span style={{ fontFamily: 'Caslon', fontSize: 48 }}>Auspice</span>
      </div>
      <div style={{ display: 'flex', flex: 1, alignItems: 'center', maxWidth: 960, fontFamily: 'Caslon', fontSize: 86, lineHeight: 1.02, letterSpacing: '-1px' }}>A little perspective. A deeper connection.</div>
      <div style={{ display: 'flex', borderTop: '3px solid #1D1B17', paddingTop: 5 }}>
        <div style={{ display: 'flex', width: '100%', borderTop: '1px solid #1D1B17', paddingTop: 22, fontSize: 23, color: '#4B463D' }}>Tarot · I Ching · Astrology · Feng shui</div>
      </div>
    </div>,
    { ...size, fonts: [{ name: 'Caslon', data: new Uint8Array(font).buffer, weight: 400, style: 'normal' }] },
  );
}
