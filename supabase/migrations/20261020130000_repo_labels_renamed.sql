-- =====================================================
-- Commit log + auto items: renamed repos
-- =====================================================
-- lib/commit-sync.ts stores GitHub's current repo name and titles auto
-- items "<repo>: ...". After the renames, new commits arrive under the new
-- names, so relabel the history to match (otherwise each app splits in two
-- and the 2-day sync overlap re-inserts commits under the new name).

update portfolio.commits set repo = case repo
    when 'duitduit'         then 'JomDuit'
    when 'TongTong'         then 'JomTumpang'
    when 'MyBeratur'        then 'JomBeratur'
    when 'edubridge'        then 'JomBeelajar'
    when 'Syllabuzz'        then 'JomBeelajar-Android'
    when 'myquiza'          then 'JomBeelajar-API'
    when 'taufik-portfolio' then 'taufikhamid'
  end
where repo in ('duitduit', 'TongTong', 'MyBeratur', 'edubridge', 'Syllabuzz', 'myquiza', 'taufik-portfolio');

with m(o, n) as (values
  ('duitduit', 'JomDuit'), ('TongTong', 'JomTumpang'), ('MyBeratur', 'JomBeratur'),
  ('edubridge', 'JomBeelajar'), ('Syllabuzz', 'JomBeelajar-Android'),
  ('myquiza', 'JomBeelajar-API'), ('taufik-portfolio', 'taufikhamid'))
update portfolio.tasks t set
  title = case when t.title like m.o || ': %'
               then m.n || substr(t.title, length(m.o) + 1) else t.title end,
  description = case when t.description like '% in ' || m.o || '.'
               then left(t.description, length(t.description) - length(m.o) - 1) || m.n || '.'
               else t.description end
from m
where t.title like m.o || ': %' or t.description like '% in ' || m.o || '.';
