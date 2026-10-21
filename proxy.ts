import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';
import { clearLegacyHostCookies } from './lib/supabase/legacy-cookies';

export async function proxy(request: NextRequest) {
  const response = await updateSession(request);
  // Jom ID: expire pre-Jom-ID host-only sb-* cookies once per browser.
  // MUST stay the very last cookie write on the response (it appends raw
  // Set-Cookie headers that a later response.cookies.set() would wipe).
  clearLegacyHostCookies(request, response);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Files with extensions (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2)$).*)',
  ],
};
