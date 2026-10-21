import type { NextRequest, NextResponse } from "next/server";
import { isJomSharedCookieHost } from "@/lib/supabase/cookie-options";

/**
 * One-time cleanup of host-only Supabase cookies left over from before Jom ID.
 *
 * Before Jom ID, each Jom app (e.g. jomduit.taufikhamid.com) wrote its
 * `sb-*` auth cookies host-only (no Domain attribute). Once apps switch to the
 * shared `.taufikhamid.com` cookie, the browser would hold BOTH a host-only
 * and a domain cookie with the same name and send both — and which one the
 * server reads is undefined, so a stale host-only session could shadow the
 * shared one (or resurrect a signed-out user).
 *
 * So, once per browser per host (tracked by a host-only `jomid-shared=1`
 * marker), expire the host-only copy of every `sb-*` cookie the request
 * carries. A `Set-Cookie` WITHOUT a Domain attribute only ever matches the
 * host-only cookie; it can never delete the shared `.taufikhamid.com` one.
 *
 * Why raw `response.headers.append("Set-Cookie", ...)` and not
 * `response.cookies.set(...)`: Next's ResponseCookies is keyed by cookie name,
 * so setting `sb-xxx-auth-token` here would REPLACE the domain cookie Supabase
 * may have just set on this same response under the same name. Appending raw
 * headers keeps both Set-Cookie lines.
 *
 * Caveat: ResponseCookies rewrites the whole Set-Cookie header list on every
 * `response.cookies.set/delete`, so this must be the LAST cookie write on the
 * response (call it at the very end of proxy.ts, after updateSession).
 */
export function clearLegacyHostCookies(request: NextRequest, response: NextResponse): void {
  if (!isJomSharedCookieHost(request.headers.get("host"))) return;
  if (request.cookies.get("jomid-shared")?.value === "1") return;

  for (const { name } of request.cookies.getAll()) {
    // Only Supabase cookies, and only names that are safe to echo back into
    // a header verbatim (cookie-name token characters).
    if (!name.startsWith("sb-") || !/^[A-Za-z0-9._-]+$/.test(name)) continue;
    response.headers.append("Set-Cookie", `${name}=; Max-Age=0; Path=/; SameSite=Lax; Secure`);
  }

  // Host-only marker so this runs once per browser per host.
  response.headers.append(
    "Set-Cookie",
    `jomid-shared=1; Max-Age=${60 * 60 * 24 * 365}; Path=/; SameSite=Lax; Secure`
  );
}
