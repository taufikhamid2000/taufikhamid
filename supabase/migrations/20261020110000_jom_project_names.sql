-- =====================================================
-- Project cards: Jom* display names
-- =====================================================
-- The apps were renamed to the Jom* family (display names, repos and
-- *.taufikhamid.com subdomains). lib/project-icon.tsx is keyed by
-- these names, so it changes in the same commit.

update portfolio.projects set name = 'JomDuit',    updated_at = now() where name = 'DuitDuit';
update portfolio.projects set name = 'JomTumpang', updated_at = now() where name = 'TongTong';
update portfolio.projects set name = 'JomBeratur', updated_at = now() where name = 'MyBeratur';

update portfolio.projects set
  name        = 'JomBeelajar',
  description = 'Web client of a three-part ecosystem with the JomBeelajar API (ASP.NET Core) and JomBeelajar Android. Supabase auth, JWT forwarded to the API for server-side scoring, XP and leaderboards.',
  updated_at  = now()
where name = 'EduBridge';

update portfolio.projects set
  name        = 'JomBeelajar API',
  description = 'ASP.NET Core (.NET 10) service on Render via Docker. Validates Supabase JWTs, scores attempts server-side, tracks XP and topic progress; shared by the JomBeelajar web and Android clients.',
  updated_at  = now()
where name = 'MyQuiza';

update portfolio.projects set
  name        = 'JomBeelajar Android',
  tagline     = 'Native Android client for the JomBeelajar API',
  description = 'Kotlin app with Retrofit against the JomBeelajar API and Supabase auth over REST. Subject → chapter → topic → quiz tree, server-scored attempts, progress and leaderboard; tested on device.',
  updated_at  = now()
where name = 'Syllabuzz';
