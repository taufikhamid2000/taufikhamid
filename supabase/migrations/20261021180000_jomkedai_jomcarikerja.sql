-- =====================================================
-- sbmp -> JomKedai, jobmatch -> JomCariKerja
-- =====================================================
-- Project cards: Jom* display names, custom domains and renamed GitHub
-- repos (same as 20261020100000 / 20261020110000). Commit log + auto
-- items: relabel the old repo names so history doesn't split in two (same
-- reasoning as 20261020130000_repo_labels_renamed.sql).

update portfolio.projects set
  name       = 'JomKedai',
  github_url = 'https://github.com/taufikhamid2000/JomKedai',
  demo_url   = 'https://jomkedai.taufikhamid.com',
  updated_at = now()
where name = 'SBMP';

update portfolio.projects set
  name       = 'JomCariKerja',
  github_url = 'https://github.com/taufikhamid2000/JomCariKerja',
  demo_url   = 'https://jomcarikerja.taufikhamid.com',
  updated_at = now()
where name = 'JobMatch';

update portfolio.commits set repo = case repo
    when 'sbmp'     then 'JomKedai'
    when 'jobmatch' then 'JomCariKerja'
  end
where repo in ('sbmp', 'jobmatch');

with m(o, n) as (values ('sbmp', 'JomKedai'), ('jobmatch', 'JomCariKerja'))
update portfolio.tasks t set
  title = case when t.title like m.o || ': %'
               then m.n || substr(t.title, length(m.o) + 1) else t.title end,
  description = case when t.description like '% in ' || m.o || '.'
               then left(t.description, length(t.description) - length(m.o) - 1) || m.n || '.'
               else t.description end
from m
where t.title like m.o || ': %' or t.description like '% in ' || m.o || '.';
