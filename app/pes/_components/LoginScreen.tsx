'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { jomIdContinueUrl, SITE_ORIGIN } from '../../../lib/jom-id';
import { signInAction, signOutAction } from '../admin-actions';
import ScreenShell from './ScreenShell';

// Owner sign-in. English only: it is an admin tool, not part of the public showcase.
export default function LoginScreen({ isOwner, onBack }: { isOwner: boolean; onBack: () => void }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ error?: string }>) =>
    start(async () => {
      const r = await fn();
      if (r.error) return setError(r.error);
      setError(null);
      router.refresh();
      onBack();
    });

  // Full-page redirect to Google; /auth/confirm exchanges the code and sends us back to /pes.
  const signInWithGoogle = async () => {
    const { error } = await createClient().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/confirm?next=/pes` },
    });
    if (error) setError(error.message);
  };

  return (
    <ScreenShell title={isOwner ? 'ADMIN' : 'SIGN IN'} onBack={onBack} hints={[{ keys: '↵', label: isOwner ? 'Sign out' : 'Sign in', kind: 'confirm' }]}>
      {isOwner ? (
        <div className="pes-form">
          <p>You are signed in as the owner. Use the Admin tile on the menu for the inbox and vision editor.</p>
          <button type="button" className="pes-btn" disabled={pending} onClick={() => run(signOutAction)}>
            SIGN OUT
          </button>
        </div>
      ) : (
        <form
          className="pes-form"
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            run(() => signInAction(String(f.get('email') ?? ''), String(f.get('password') ?? '')));
          }}
        >
          <label>
            Email
            <input name="email" type="email" autoComplete="username" required autoFocus />
          </label>
          <label>
            Password
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          {error && <p role="alert" className="pes-form-error">{error}</p>}
          <button type="submit" className="pes-btn" disabled={pending}>
            {pending ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
          <button type="button" className="pes-btn pes-btn--ghost" disabled={pending} onClick={signInWithGoogle}>
            CONTINUE WITH GOOGLE
          </button>
          <p className="pes-form-or" aria-hidden="true">or</p>
          {/* Jom ID portal sign-in; returns to the owner-tools screen on the home page. */}
          <a className="pes-btn pes-btn--ghost" href={jomIdContinueUrl(`${SITE_ORIGIN}/#login`)}>
            CONTINUE WITH JOM ID
          </a>
          <a className="pes-form-link" href="/auth/reset-password">
            Forgot password?
          </a>
        </form>
      )}
    </ScreenShell>
  );
}
