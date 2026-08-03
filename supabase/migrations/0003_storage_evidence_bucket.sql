-- Storage bucket for scam report evidence (screenshots, PDFs).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('evidence', 'evidence', true, 10485760, array['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])
on conflict (id) do nothing;

-- Anyone can upload evidence (rate-limited at the API layer, see src/lib/rate-limit.ts).
create policy "evidence_bucket_insert" on storage.objects
  for insert with check (bucket_id = 'evidence');

-- Evidence files are publicly readable once attached to an approved report;
-- the application layer only links files after report creation.
create policy "evidence_bucket_read" on storage.objects
  for select using (bucket_id = 'evidence');

-- Only moderators/admins can delete evidence (e.g. after rejecting a report for TOS reasons).
create policy "evidence_bucket_delete" on storage.objects
  for delete using (bucket_id = 'evidence' and public.is_moderator_or_admin());
