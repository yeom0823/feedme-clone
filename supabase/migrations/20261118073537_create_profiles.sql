-- One profile per Auth user, removed together with the user.
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  display_name text check (char_length(display_name) <= 50),
  primary key (id)
);

-- Rows are created by the trigger and removed by the cascade,
-- so signed-in users only need to read and update their own row.
revoke all on public.profiles from anon, authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  to authenticated
  using ( (select auth.uid()) = id );

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- Creates the profile row whenever a user signs up.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
