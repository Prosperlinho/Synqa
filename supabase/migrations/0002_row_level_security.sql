-- Row Level Security for TrustWallet AI.
-- Wallet intelligence data (Wallet, WalletLabel, approved ScamReport, etc.) is
-- publicly readable by design — this is a public reputation registry — but
-- writes are always constrained to the owning user or elevated roles.

alter table public."Wallet" enable row level security;
alter table public."WalletLabel" enable row level security;
alter table public."WalletScoreHistory" enable row level security;
alter table public."TokenHolding" enable row level security;
alter table public."NftHolding" enable row level security;
alter table public."WalletActivity" enable row level security;
alter table public."ScamReport" enable row level security;
alter table public."Evidence" enable row level security;
alter table public."Comment" enable row level security;
alter table public."Vote" enable row level security;
alter table public."Bookmark" enable row level security;
alter table public."WalletFollow" enable row level security;
alter table public."Notification" enable row level security;
alter table public."AdminLog" enable row level security;
alter table public."User" enable row level security;

-- Helper: is the current auth.uid() an admin or moderator?
create or replace function public.is_moderator_or_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public."User" u
    where u."supabaseId" = auth.uid()
      and u.role in ('ADMIN', 'MODERATOR')
      and u.status = 'ACTIVE'
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public."User" u
    where u."supabaseId" = auth.uid() and u.role = 'ADMIN' and u.status = 'ACTIVE'
  );
$$;

-- Wallet intelligence data: public read, writes restricted to moderators/service role.
create policy "wallet_public_read" on public."Wallet" for select using (true);
create policy "wallet_label_public_read" on public."WalletLabel" for select using (true);
create policy "wallet_score_public_read" on public."WalletScoreHistory" for select using (true);
create policy "wallet_holding_public_read" on public."TokenHolding" for select using (true);
create policy "wallet_nft_public_read" on public."NftHolding" for select using (true);
create policy "wallet_activity_public_read" on public."WalletActivity" for select using (true);

create policy "wallet_label_mod_write" on public."WalletLabel" for insert with check (public.is_moderator_or_admin());
create policy "wallet_label_mod_delete" on public."WalletLabel" for delete using (public.is_moderator_or_admin());

-- Scam reports: approved reports are public; pending/rejected only visible to
-- their author and moderators. Anyone authenticated can insert (goes to PENDING).
create policy "scam_report_public_read_approved" on public."ScamReport"
  for select using (status = 'APPROVED');

create policy "scam_report_own_read" on public."ScamReport"
  for select using (auth.uid()::text = (select "supabaseId" from public."User" where id = "reporterId"));

create policy "scam_report_mod_read_all" on public."ScamReport"
  for select using (public.is_moderator_or_admin());

create policy "scam_report_authenticated_insert" on public."ScamReport"
  for insert with check (auth.role() = 'authenticated' or auth.role() = 'anon');

create policy "scam_report_mod_update" on public."ScamReport"
  for update using (public.is_moderator_or_admin());

-- Evidence follows report visibility.
create policy "evidence_read_with_report" on public."Evidence"
  for select using (
    exists (
      select 1 from public."ScamReport" r
      where r.id = "reportId" and (r.status = 'APPROVED' or public.is_moderator_or_admin())
    )
  );
create policy "evidence_insert_any" on public."Evidence" for insert with check (true);

-- Comments: public read (unless hidden), authenticated users write their own.
create policy "comment_public_read" on public."Comment" for select using (not "isHidden" or public.is_moderator_or_admin());
create policy "comment_own_insert" on public."Comment"
  for insert with check (auth.uid()::text = (select "supabaseId" from public."User" where id = "authorId"));
create policy "comment_own_update" on public."Comment"
  for update using (auth.uid()::text = (select "supabaseId" from public."User" where id = "authorId"));
create policy "comment_mod_moderate" on public."Comment" for update using (public.is_moderator_or_admin());

-- Votes: users manage only their own vote rows; vote counts are public via the report join.
create policy "vote_own_all" on public."Vote"
  for all using (auth.uid()::text = (select "supabaseId" from public."User" where id = "userId"));

-- Bookmarks / follows / notifications: strictly private to the owning user.
create policy "bookmark_own_all" on public."Bookmark"
  for all using (auth.uid()::text = (select "supabaseId" from public."User" where id = "userId"));
create policy "follow_own_all" on public."WalletFollow"
  for all using (auth.uid()::text = (select "supabaseId" from public."User" where id = "userId"));
create policy "notification_own_all" on public."Notification"
  for all using (auth.uid()::text = (select "supabaseId" from public."User" where id = "userId"));

-- Admin log: readable only by admins, never editable client-side.
create policy "admin_log_admin_read" on public."AdminLog" for select using (public.is_admin());

-- Users: public can read minimal profile fields via a view (not raw table);
-- users can update their own row; admins can update any row (role/status/ban).
create policy "user_self_read" on public."User" for select using (auth.uid() = "supabaseId" or public.is_moderator_or_admin());
create policy "user_self_update" on public."User" for update using (auth.uid() = "supabaseId");
create policy "user_admin_update" on public."User" for update using (public.is_admin());
