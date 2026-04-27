-- Table: service_media
-- Stores video/image media items linked to each service card
create table if not exists public.service_media (
  id          uuid primary key default gen_random_uuid(),
  service_id  uuid not null references public.services(id) on delete cascade,
  type        text not null default 'video' check (type in ('video', 'image')),
  url         text not null,
  thumbnail_url text null,
  label       text null,
  handle      text null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.service_media enable row level security;

-- Public read
create policy "service_media_public_read"
  on public.service_media for select
  using (true);

-- Admin write
create policy "service_media_admin_write"
  on public.service_media for all
  using (public.has_role('admin'::public.app_role, auth.uid()));

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger service_media_updated_at
  before update on public.service_media
  for each row execute procedure public.set_updated_at();

-- Create Supabase Storage bucket for service media (videos & images)
insert into storage.buckets (id, name, public)
values ('service-media', 'service-media', true)
on conflict (id) do nothing;

create policy "service_media_storage_public_read"
  on storage.objects for select
  using (bucket_id = 'service-media');

create policy "service_media_storage_admin_write"
  on storage.objects for insert
  using (bucket_id = 'service-media' and public.has_role('admin'::public.app_role, auth.uid()));
