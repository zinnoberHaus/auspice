import type { NextConfig } from "next";
const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ] }, ...['/account/:path*', '/sanctuary/:path*', '/admin/:path*', '/api/:path*',
      ...(process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development' ? ['/:path*'] : []),
    ].map(source => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }))];
  },
};
export default config;
