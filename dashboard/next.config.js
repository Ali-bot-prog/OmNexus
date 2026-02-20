/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/emsal',
        destination: 'http://localhost:5555/emsal',
      },
      {
        source: '/emsal/:path*',
        destination: 'http://localhost:5555/emsal/:path*',
      },
      {
        source: '/estimate/:path*',
        destination: 'http://localhost:5555/estimate/:path*',
      },
      {
         source: '/export-pdf',
         destination: 'http://localhost:5555/export-pdf',
      },
      {
        source: '/health',
        destination: 'http://localhost:5555/health',
      },
    ];
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development', // Dev modunda da çalışsın diye kapattık
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
