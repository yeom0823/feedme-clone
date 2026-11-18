-- A snapshot of one converted page, owned by one user and removed together with the user.
create table public.saved_articles (
  id uuid not null default gen_random_uuid() primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  url text not null,
  title text not null,
  author text not null default '',
  site text not null default '',
  markdown text not null,
  saved_at timestamptz not null default now(),
  -- One saved copy per URL (exact string match) per user.
  unique (user_id, url)
);

-- Lists are read newest first per user.
create index saved_articles_user_saved_at_idx on public.saved_articles (user_id, saved_at desc);

-- Saved articles are never edited, only created, read and deleted by their owner.
revoke all on public.saved_articles from anon, authenticated;
grant select, insert, delete on public.saved_articles to authenticated;
grant select, insert, update, delete on public.saved_articles to service_role;

alter table public.saved_articles enable row level security;

create policy "Users can view their own saved articles"
  on public.saved_articles for select
  to authenticated
  using ( (select auth.uid()) = user_id );

create policy "Users can save articles for themselves"
  on public.saved_articles for insert
  to authenticated
  with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own saved articles"
  on public.saved_articles for delete
  to authenticated
  using ( (select auth.uid()) = user_id );
