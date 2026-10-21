import { createBrowserClient } from '@supabase/ssr';
import { jomCookieOptions } from './cookie-options';

/**
 * Browser-side Supabase client. Use in Client Components.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_KEY)!,
    {
      db: { schema: 'portfolio' },
      // Jom ID: on taufikhamid.com in production the session cookie lives on
      // `.taufikhamid.com`, shared with every *.taufikhamid.com app.
      cookieOptions: jomCookieOptions(typeof window === 'undefined' ? undefined : window.location.hostname),
    }
  );
}
