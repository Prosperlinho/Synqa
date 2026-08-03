-- Keeps public."User" (Prisma-managed) in sync with Supabase's auth.users.
-- Run this after `prisma migrate deploy` has created the User table.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public."User" (id, "supabaseId", username, email, role, status, reputation, "createdAt", "updatedAt")
  values (
    gen_random_uuid()::text,
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)) || '_' || substr(new.id::text, 1, 6),
    new.email,
    'USER',
    'ACTIVE',
    0,
    now(),
    now()
  )
  on conflict ("supabaseId") do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_auth_user();
