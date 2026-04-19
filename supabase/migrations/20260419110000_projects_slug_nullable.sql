-- Make slug optional: drop NOT NULL constraint and unique index
-- (URL routing now uses the project UUID directly)
ALTER TABLE public.projects ALTER COLUMN slug DROP NOT NULL;
DROP INDEX IF EXISTS projects_slug_unique;
