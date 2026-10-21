import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies, headers } from 'next/headers';
import { jomCookieOptions } from './cookie-options';

interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

/**
 * Server-side Supabase client. Uses cookies for session.
 * Use in Server Components, Server Actions, and Route Handlers.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const host = (await headers()).get('host');

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_KEY)!,
    {
      db: { schema: 'portfolio' },
      // Jom ID: shared `.taufikhamid.com` session cookie (see ./cookie-options).
      cookieOptions: jomCookieOptions(host),
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            // `options` carries the Jom ID domain/path — it must be forwarded.
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component — cookies cannot be set here.
            // Safe to ignore if middleware refreshes the session.
          }
        },
      },
    }
  );
}
