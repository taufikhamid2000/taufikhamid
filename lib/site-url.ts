/**
 * Returns the absolute base URL of this deployment.
 * Priority: production → https://taufikhamid.com, then NEXT_PUBLIC_SITE_URL →
 * NEXT_PUBLIC_VERCEL_URL → VERCEL_URL → localhost.
 * Always returns a URL with no trailing slash.
 *
 * Note: VERCEL_URL is Vercel's auto-generated deployment URL (e.g. taufik-xxx.vercel.app),
 * not the custom domain, so production pins the custom domain here (a stale
 * NEXT_PUBLIC_SITE_URL once published taufik.vercel.app in the sitemap).
 */
export function getSiteUrl(): string {
  let url =
    (process.env.VERCEL_ENV === 'production' ? 'https://taufikhamid.com' : undefined) ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL && `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`) ??
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
    'http://localhost:3000';
  if (!url.startsWith('http')) url = `https://${url}`;
  if (url.endsWith('/')) url = url.slice(0, -1);
  return url;
}
