import Link from 'next/link';
import { signIn } from './actions';
import { AuthBrandingPanel } from './auth-branding-panel';
import { LogoMark } from './logo-mark';
import { PasswordInput } from './password-input';
import { SubmitButton } from '../_components/submit-button';
import { GoogleSignInButton } from './GoogleSignInButton';
import { ThemeToggle } from '../_components/theme-toggle';
import { SITE } from '../../lib/site';
import { jomIdContinueUrl, SITE_ORIGIN } from '../../lib/jom-id';

interface LoginPageProps {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}

// Split-screen layout matching the owner's other projects (see DESIGN.md's
// "Auth pages" pattern) — this repo's /login is an owner-only admin gate
// (see app/_components/auth-nav.tsx), not a public signup, but it should
// still look like it belongs to the same body of work.
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, redirect: redirectTo } = await searchParams;
  // Same landing spot the password form uses (actions.ts defaults to /#login);
  // only same-site paths, so ?redirect= can't point Jom ID somewhere else.
  const jomNextPath =
    redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//') && !redirectTo.includes('\\')
      ? redirectTo
      : '/#login';

  return (
    <div className="relative flex min-h-screen flex-col md:flex-row md:items-stretch bg-background text-foreground">
      <AuthBrandingPanel />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-muted px-4 py-16">
        <div className="absolute right-4 top-4 z-10">
          <ThemeToggle />
        </div>

        <Link href="/" className="flex items-center gap-2 md:hidden">
          <LogoMark size={28} />
          <span className="text-lg font-semibold text-foreground">{SITE.name}</span>
        </Link>

        <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-8 animate-page-in">
          <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
          <p className="mb-6 text-sm text-foreground/60">Admin access only. Sign in to manage your projects.</p>

          <form action={signIn} className="flex flex-col gap-3">
            {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              required
              autoComplete="email"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? 'login-form-error' : undefined}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
            />
            <PasswordInput
              id="password"
              name="password"
              required
              autoComplete="current-password"
              ariaInvalid={!!error}
              ariaDescribedBy={error ? 'login-form-error' : undefined}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
            />
            {error && (
              <p id="login-form-error" role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
            <SubmitButton
              pendingText="Signing in…"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Sign in
            </SubmitButton>
          </form>

          <div className="mt-6 flex items-center gap-3 text-xs text-foreground/40">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <GoogleSignInButton />
            {/* Jom ID portal sign-in; returns to wherever this form would have sent us. */}
            <a
              href={jomIdContinueUrl(SITE_ORIGIN + jomNextPath)}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors text-sm font-medium"
            >
              Continue with Jom ID
            </a>
          </div>

          <div className="mt-6 text-xs text-center space-y-2 text-foreground/60">
            <p>
              <Link href="/auth/reset-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </p>
            <p>
              Don&apos;t have an account?{' '}
              <span className="text-foreground/70">Create one in your Supabase dashboard.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
