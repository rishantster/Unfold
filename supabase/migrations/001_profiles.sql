create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle text unique not null check (handle ~ '^[a-z0-9_-]{3,30}$'),
  name text not null check (char_length(name) between 1 and 80),
  headline text not null default '',
  bio text not null default '' check (char_length(bio) <= 180),
  whatsapp text not null default '',
  portfolio text not null default '',
  avatar_url text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Profiles are public" on public.profiles for select using (true);
create policy "Users create their profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users update their profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
