-- Create verifications table and RLS policies

create table if not exists public.verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  bucket text not null default 'submissions',
  file_path text not null,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- enable Row Level Security
alter table public.verifications enable row level security;

-- Allow authenticated users to insert records for themselves
create policy "Allow insert for authenticated users (owner)" on public.verifications
  for insert with check (auth.uid() = user_id);

-- Allow users to select their own records
create policy "Allow select for owner" on public.verifications
  for select using (auth.uid() = user_id);

-- Allow users to update their own records (optional: allow cancel)
create policy "Allow update for owner" on public.verifications
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Note: service_role key bypasses RLS so backend administrators can access all records for review.
-- Create an index to speed lookups by user
create index if not exists idx_verifications_user_id on public.verifications(user_id);
