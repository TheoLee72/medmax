-- Drop existing policies to ensure clean slate
drop policy if exists "Allow insert for authenticated users (owner)" on public.verifications;
drop policy if exists "Allow select for owner" on public.verifications;
drop policy if exists "Allow update for owner" on public.verifications;

-- Recreate policies with explicit 'to authenticated'
create policy "Enable insert for authenticated users only"
on public.verifications
for insert
to authenticated
with check (
  auth.uid() = user_id
);

create policy "Enable select for users based on user_id"
on public.verifications
for select
to authenticated
using (
  auth.uid() = user_id
);

create policy "Enable update for users based on user_id"
on public.verifications
for update
to authenticated
using (
  auth.uid() = user_id
)
with check (
  auth.uid() = user_id
);

-- Ensure permissions are granted
grant all on table public.verifications to authenticated;
grant all on table public.verifications to service_role;
