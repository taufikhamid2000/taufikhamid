-- =====================================================
-- Project links: renamed GitHub repos + custom domains
-- =====================================================
-- Six repos were renamed to the Jom* names and the apps moved to
-- *.taufikhamid.com subdomains. GitHub and the old .vercel.app hosts
-- redirect, but the cards should link to the real addresses.

update portfolio.projects set
  github_url = 'https://github.com/taufikhamid2000/JomDuit',
  demo_url   = 'https://jomduit.taufikhamid.com',
  updated_at = now()
where name = 'DuitDuit';

update portfolio.projects set
  github_url = 'https://github.com/taufikhamid2000/JomTumpang',
  demo_url   = 'https://jomtumpang.taufikhamid.com',
  updated_at = now()
where name = 'TongTong';

update portfolio.projects set
  github_url = 'https://github.com/taufikhamid2000/JomBeratur',
  demo_url   = 'https://jomberatur.taufikhamid.com',
  updated_at = now()
where name = 'MyBeratur';

update portfolio.projects set
  github_url = 'https://github.com/taufikhamid2000/JomBeelajar',
  demo_url   = 'https://jombeelajar.taufikhamid.com',
  updated_at = now()
where name = 'EduBridge';

update portfolio.projects set
  github_url = 'https://github.com/taufikhamid2000/JomBeelajar-Android',
  updated_at = now()
where name = 'Syllabuzz';

update portfolio.projects set
  github_url = 'https://github.com/taufikhamid2000/JomBeelajar-API',
  updated_at = now()
where name = 'MyQuiza';

update portfolio.projects set
  demo_url   = 'https://jomkomute.taufikhamid.com',
  updated_at = now()
where name = 'JomKomute';
