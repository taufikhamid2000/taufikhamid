-- =====================================================
-- Veyoyee -> JomSurvei
-- =====================================================
-- Project card: new name, custom domain and GitHub repo. Commit log + auto
-- items: relabel the old repo name so history doesn't split in two (same
-- reasoning as 20261020130000_repo_labels_renamed.sql).

update portfolio.projects set
  name = 'JomSurvei',
  demo_url = 'https://jomsurvei.taufikhamid.com/',
  github_url = 'https://github.com/taufikhamid2000/JomSurvei'
where id = '63398e01-5346-47e1-a39b-30897ba7b420';

update portfolio.commits set repo = 'JomSurvei' where repo = 'veyoyee';

update portfolio.tasks set
  title = case when title like 'veyoyee: %'
               then 'JomSurvei' || substr(title, length('veyoyee') + 1) else title end,
  description = case when description like '% in veyoyee.'
               then left(description, length(description) - length('veyoyee') - 1) || 'JomSurvei.'
               else description end
where title like 'veyoyee: %' or description like '% in veyoyee.';
