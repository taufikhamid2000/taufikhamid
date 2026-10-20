-- =====================================================
-- Initiatives: Jom* product names
-- =====================================================
-- Follows 20261020110000_jom_project_names.sql: the initiative text
-- (English and Malay) still named the apps by their old names.

update portfolio.initiatives set
  idea       = replace(replace(replace(replace(replace(replace(replace(idea,
                 'EduBridge/MyQuiza', 'JomBeelajar'),
                 'MyQuiza API', 'JomBeelajar API'),
                 'API MyQuiza', 'API JomBeelajar'),
                 'MyQuiza', 'JomBeelajar API'),
                 'Syllabuzz', 'JomBeelajar Android'),
                 'EduBridge', 'JomBeelajar'),
                 'MyBeratur', 'JomBeratur'),
  idea_ms    = replace(replace(replace(replace(replace(replace(replace(idea_ms,
                 'EduBridge/MyQuiza', 'JomBeelajar'),
                 'MyQuiza API', 'JomBeelajar API'),
                 'API MyQuiza', 'API JomBeelajar'),
                 'MyQuiza', 'JomBeelajar API'),
                 'Syllabuzz', 'JomBeelajar Android'),
                 'EduBridge', 'JomBeelajar'),
                 'MyBeratur', 'JomBeratur'),
  problem    = replace(problem, 'EduBridge', 'JomBeelajar'),
  problem_ms = replace(problem_ms, 'EduBridge', 'JomBeelajar')
where concat_ws(' ', idea, idea_ms, problem, problem_ms)
      ~ '(EduBridge|MyQuiza|Syllabuzz|MyBeratur)';
