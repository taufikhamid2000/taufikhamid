-- Security audit M9: the project-screenshots bucket had no size or MIME limit.
-- Only the admin can write (storage policy), and the admin flow uploads images
-- (png/jpg/webp/gif/svg per admin-actions.ts CONTENT_TYPES). Existing objects are unaffected.
update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['image/png','image/jpeg','image/webp','image/gif','image/svg+xml','image/avif']
where id = 'project-screenshots';
