ALTER TABLE public.services ADD COLUMN IF NOT EXISTS icon text NOT NULL DEFAULT 'Sparkles';
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;