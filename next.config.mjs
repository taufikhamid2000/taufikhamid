/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
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