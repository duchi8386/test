ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS gallery_urls JSONB;
