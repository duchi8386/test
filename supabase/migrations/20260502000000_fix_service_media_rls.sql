-- Fix: service_media_admin_write policy had swapped has_role() arguments
-- Before: has_role('admin'::app_role, auth.uid())  ← wrong order
-- After:  has_role(auth.uid(), 'admin'::app_role)  ← correct order

drop policy if exists "service_media_admin_write" on public.service_media;

create policy "service_media_admin_write"
  on public.service_media for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'::public.app_role))
  with check (public.has_role(auth.uid(), 'admin'::public.app_role));
