import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { isJomSharedCookieHost, jomCookieOptions } from './cookie-options';

interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

/**
 * Refresh the Supabase session in middleware so cookies stay current.
 * Returns the NextResponse with refreshed cookies attached.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_KEY)!,
    {
      db: { schema: 'portfolio' },
      // Jom ID: shared `.taufikhamid.com` session cookie (see ./cookie-options).
      cookieOptions: jomCookieOptions(request.headers.get('host')),
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT: do not run any logic between createServerClient and getUser().
  // A simple mistake could make it very hard to debug session refresh issues.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirects must carry every cookie Supabase set on supabaseResponse (refreshed
  // or cleared session), with their options (Jom ID domain/path) intact.
  const redirectWithCookies = (url: URL) => {
    const res = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => res.cookies.set(cookie));
    return res;
  };

  const ALLOWED_EMAILS = ['putrasabah41@gmail.com', 'taufikhamid2000@gmail.com'];
  const GOOGLE_ALLOWED_EMAILS = ['taufikhamid2000@gmail.com'];

  // Jom ID: on taufikhamid.com the session cookie is SHARED with every
  // *.taufikhamid.com app, so signOut() here would log a JomDuit/JomTumpang/...
  // user out of every Jom app just for visiting the portfolio. There, a
  // non-allowlisted user simply stays a non-owner viewer — owner-only writes
  // are still gated by getIsOwner() (lib/auth.ts) and RLS. The allowlist
  // sign-out below only applies on host-only cookie hosts (localhost, previews).
  const sharedSession = isJomSharedCookieHost(request.headers.get('host'));

  // If signed in but not on the allowlist, sign them out and bounce to login
  if (!sharedSession && user && !ALLOWED_EMAILS.includes(user.email ?? '')) {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '?error=' + encodeURIComponent('Access denied.');
    return redirectWithCookies(url);
  }

  // Block Google sign-in for non-Google-allowlisted accounts.
  // Uses user.identities (not app_metadata.provider) because app_metadata.provider
  // reflects the account's *first* provider, not the current sign-in method —
  // so it stays 'email' even when the user signs in via Google on an email account.
  const hasGoogleIdentity = user?.identities?.some((id: { provider: string }) => id.provider === 'google') ?? false;
  if (!sharedSession && user && hasGoogleIdentity &&!GOOGLE_ALLOWED_EMAILS.includes(user.email ?? '')) {
    await supabase.auth.signOut();
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '?error=' + encodeURIComponent('Google sign-in not permitted for this account.');
    return redirectWithCookies(url);
  }

  // /admin is public-read now (see lib/auth.ts) — no blanket redirect here.
  // Owner-only writes are gated per-page/per-action instead, backed by RLS.

  // If already logged in and hitting /login, send to the home page
  if (user && request.nextUrl.pathname === '/login') {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return redirectWithCookies(url);
  }

  return supabaseResponse;
}
