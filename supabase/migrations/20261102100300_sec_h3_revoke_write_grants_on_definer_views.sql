-- Definer views are intentional (mask private commits, hide owner_secret/user_id, public leaderboards); make them read-only for API roles.
revoke insert, update, delete, truncate, references, trigger on portfolio.public_commits from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on jomkomute.user_reports_visible from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on pitchlife.hall_of_fame from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on pitchlife.playing_now from anon, authenticated;
