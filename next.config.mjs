/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    // Jom ID: lib/supabase/cookie-options.ts reads NEXT_PUBLIC_VERCEL_ENV in the
    // browser to decide whether to write the shared `.taufikhamid.com` cookie.
    // Vercel only exposes NEXT_PUBLIC_VERCEL_ENV when "Automatically expose System
    // Environment Variables" is on, so fall back to VERCEL_ENV (always set at
    // build time on Vercel) and inline it explicitly. Without this the browser
    // would write host-only cookies while the server writes domain cookies.
    env: {
        NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV ?? '',
    },
    // The classic admin pages were replaced by owner tools inside the PES view.
    async redirects() {
      return [
        // Old *.vercel.app address -> the custom domain.
        {
          source: '/:path*',
          has: [{ type: 'host', value: 'taufik.vercel.app' }],
          destination: 'https://taufikhamid.com/:path*',
          permanent: false,
        },
        { source: '/admin/:path*', destination: '/#login', permanent: false },
      ];
    },
    images: {
        formats: ['image/avif', 'image/webp'],
        // Uploaded project screenshots live in Supabase Storage's public bucket.
        remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }],
    },
};

export default nextConfig;