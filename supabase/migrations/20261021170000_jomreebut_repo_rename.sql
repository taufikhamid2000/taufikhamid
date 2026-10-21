-- =====================================================
-- proxlox -> JomReebut (GitHub repo)
-- =====================================================
-- The project card was renamed earlier but still linked the old repo URL,
-- and the commit log / auto items still used the old repo name (same
-- reasoning as 20261020130000_repo_labels_renamed.sql).

update portfolio.projects set github_url = 'https://github.com/taufikhamid2000/JomReebut'
where id = '6899b8a9-814a-4402-9292-4e8e592eb8d2';

update portfolio.commits set repo = 'JomReebut' where repo = 'proxlox';

update portfolio.tasks set
  title = case when title like 'proxlox: %'
               then 'JomReebut' || substr(title, length('proxlox') + 1) else title end,
  description = case when description like '% in proxlox.'
               then left(description, length(description) - length('proxlox') - 1) || 'JomReebut.'
               else description end
where title like 'proxlox: %' or description like '% in proxlox.';
