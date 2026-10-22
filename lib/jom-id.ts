/** Jom ID portal (shared Supabase session across *.taufikhamid.com). */
export const JOM_ID_URL = 'https://jomid.taufikhamid.com';

/** Canonical origin of this site — Jom ID only returns to taufikhamid.com hosts. */
export const SITE_ORIGIN = 'https://taufikhamid.com';

/**
 * "Continue with Jom ID" link: signs in at the portal (if not already) and
 * returns to `next`, an absolute https://taufikhamid.com/... URL.
 */
export function jomIdContinueUrl(next: string): string {
  return `${JOM_ID_URL}/continue?next=${encodeURIComponent(next)}`;
}
