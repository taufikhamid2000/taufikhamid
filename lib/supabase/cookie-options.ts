/**
 * Jom ID shared-session cookie options.
 *
 * COPY THIS FILE VERBATIM into every Jom app (JomDuit, JomTumpang, JomBeelajar,
 * ...). Every app talks to the same Supabase project, so if they all write the
 * Supabase auth cookies (`sb-<project-ref>-auth-token*`) on the parent domain
 * `.taufikhamid.com`, signing in once at https://akaun.taufikhamid.com signs
 * you in on every *.taufikhamid.com app, and signing out anywhere signs you out
 * everywhere.
 *
 * Keep it dependency-free (only @supabase/ssr *types*), so it can be dropped
 * into any app without pulling anything else along.
 *
 * Usage — pass the result as `cookieOptions` to every Supabase client:
 *
 *   // Browser
 *   createBrowserClient(url, key, {
 *     cookieOptions: jomCookieOptions(
 *       typeof window === "undefined" ? undefined : window.location.hostname
 *     ),
 *   });
 *
 *   // Server Component / Server Action / Route Handler
 *   createServerClient(url, key, {
 *     cookieOptions: jomCookieOptions((await headers()).get("host")),
 *     cookies: { getAll, setAll }, // setAll MUST forward `options` to the cookie write
 *   });
 *
 *   // proxy.ts
 *   createServerClient(url, key, {
 *     cookieOptions: jomCookieOptions(request.headers.get("host")),
 *     cookies: { ... },
 *   });
 */
import type { CookieOptionsWithName } from "@supabase/ssr";

/** Parent domain every Jom app lives under. The leading dot = "this domain and all subdomains". */
export const JOM_ID_COOKIE_DOMAIN = ".taufikhamid.com";

// NEXT_PUBLIC_VERCEL_ENV is inlined into the browser bundle at build time;
// VERCEL_ENV is the server-side equivalent. Off Vercel neither is set, which
// means "not production" -> host-only cookies (safe default for localhost).
const VERCEL_ENV = process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.VERCEL_ENV;

/**
 * True when cookies for this host should be written on the shared
 * `.taufikhamid.com` domain.
 *
 * Why the host check and not just "is production": a production deployment
 * is ALSO reachable on its `*.vercel.app` address, and a browser rejects a
 * cookie whose Domain doesn't match the current host — so on vercel.app we'd
 * silently fail to store the session at all. Only share when the request is
 * actually on taufikhamid.com or one of its subdomains.
 *
 * @param host Request `Host` header (server) or `window.location.hostname`
 *             (browser). A `:port` suffix is ignored.
 */
export function isJomSharedCookieHost(host?: string | null): boolean {
  const h = (host ?? "").split(":")[0].toLowerCase();
  return VERCEL_ENV === "production" && (h === "taufikhamid.com" || h.endsWith(".taufikhamid.com"));
}

/** Cookie options for every Supabase client. host = request host (server) or window.location.hostname (browser). */
export function jomCookieOptions(host?: string | null): CookieOptionsWithName {
  return isJomSharedCookieHost(host)
    ? // Shared: one session cookie for every *.taufikhamid.com app.
      { domain: JOM_ID_COOKIE_DOMAIN, path: "/", sameSite: "lax", secure: true }
    : // Host-only: localhost, preview deployments, *.vercel.app.
      { path: "/", sameSite: "lax", secure: VERCEL_ENV === "production" };
}
