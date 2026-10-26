# Architecture

Written from reading the code; file paths are the source of truth if this drifts.

## Routing (Next.js App Router)

- `/` (`app/page.tsx`) is a single server component that loads projects, commits, sprints and Vision data (in the visitor's locale) and the owner flag, then renders the client app `app/pes/_components/PesApp.tsx`: a menu-driven "PES-style" UI with screens for About, Projects, Sprints, Vision, Contact, Options and, for the owner, Admin/Inbox. `/pes` just redirects to `/`. If Supabase sends an auth `?code=` to `/`, the page forwards it to `app/auth/confirm`.
- `/vision/*` (English) and `/ms/vision/*` (Bahasa Malaysia) are separate route trees with the same shape: index, `ministries`, `initiatives`, and `[slug]` per ministry. Locale is therefore part of the URL, not a cookie. UI strings come from `lib/i18n.ts`; content translations are `*_ms` columns.
- `/login`, `/auth/{confirm,error,reset-password,update-password}` handle Supabase Auth (email/password, Google).
- `/classic` is the older page layout; `app/sitemap.ts` and `app/robots.ts` generate SEO files (sitemap reads ministry slugs from Supabase).
- `proxy.ts` (Next 16's middleware) calls `lib/supabase/middleware.ts` `updateSession` on nearly every request to refresh the Supabase session cookie, then `clearLegacyHostCookies` (must stay last, see the comment in the file).

## Data layer

- All data is in one hosted Supabase Postgres project, in the custom schema `portfolio` (every client sets `db: { schema: 'portfolio' }`). Tables used in code: `projects`, `sprints`, `tasks`, `commits`, `ministries`, `initiatives`, `submissions`. Schema and content changes are timestamped SQL files in `supabase/migrations/`.
- Typed access functions live in `lib/` (`projects.ts`, `sprints.ts`, `tasks.ts`, `commits.ts`, `vision.ts`); components do not query Supabase directly.
- Three Supabase clients in `lib/supabase/`:
  - `server.ts`: cookie-bound client for Server Components and Server Actions (acts as the signed-in user).
  - `public.ts`: cookieless anon client for public reads at build time (`generateStaticParams`, sitemap).
  - `client.ts`: browser client.
- The session cookie is shared across `.taufikhamid.com` subdomains (`lib/supabase/cookie-options.ts`, "Jom ID").
- `lib/commit-sync.ts` pulls commits from the GitHub API (needs `GITHUB_TOKEN`) into `portfolio.commits`; it is triggered only by the owner-only `syncCommitsAction`.

## Owner gating

There is one writer: the owner email in `lib/auth.ts` (`ADMIN_EMAIL`). Two layers:

1. App: `getIsOwner()` compares the Supabase user's email to `ADMIN_EMAIL`. Owner Server Actions (`app/pes/admin-actions.ts`, `sync-action.ts`) check it first and return an error otherwise, before any expensive work.
2. Database: Row Level Security. Reads are public on public tables; insert/update/delete policies name the same email. Anonymous visitors may only insert `submissions` rows with status `pending`.

Public idea submission (`app/vision/actions.ts`) uses a honeypot field, validates length, and inserts as `pending`; nothing is shown until the owner approves it.

## Translation flow

1. English content lives in `ministries.name/description` and `initiatives.problem/idea`; Malay in the matching `*_ms` columns.
2. The owner opens the Inbox screen and presses "Translate missing", which calls `translateMissingAction` (`app/pes/admin-actions.ts`).
3. The action checks the owner, selects rows where any `*_ms` is null, and calls `translateToMalay` (`lib/translate.ts`, `server-only`) per missing field. That sends one request to Claude (`claude-haiku-4-5`, `max_tokens: 1024`) with a system prompt asking for formal Bahasa Malaysia with brand names and URLs kept verbatim.
4. The result is written straight to the row and `/ms/vision` and `/` are revalidated. The `/ms/vision` pages read the `*_ms` columns.

Note: the action writes the model output without running `lib/translation-eval.ts` on it; the checker is currently an offline tool (`npm run eval:translations`) over exported pairs. Wiring it into the action, and handling a `max_tokens` stop reason in `translateToMalay`, are possible follow-ups.

## Build and deploy

CI (`.github/workflows/ci.yml`): install, lint, typecheck, unit tests, offline translation eval, build (with placeholder Supabase env if secrets are absent). Vercel deploys `main` (region `sin1`, `vercel.json`).
