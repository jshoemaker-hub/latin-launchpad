-- ICRA Field: Supabase schema
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste this file -> Run.
--
-- Design: every action in the app is an event row. Rows can be inserted but never updated or
-- deleted, so the table is the audit trail. The server stamps who wrote each row (from the
-- signed-in user) and their role (from project membership), so a client can't forge either.

-- Projects ------------------------------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key,
  name text not null,
  facility text not null default '',
  created_by uuid not null default auth.uid() references auth.users (id),
  created_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects (id) on delete cascade,
  email text not null check (email = lower(email)),
  name text not null default '',
  role text not null check (role in ('worker', 'foreman', 'superintendent', 'ip', 'facilities', 'safety', 'viewer')),
  added_at timestamptz not null default now(),
  primary key (project_id, email)
);

create or replace function public.my_email() returns text
language sql stable as $$
  select lower(coalesce(auth.jwt() ->> 'email', ''))
$$;

create or replace function public.member_role(p uuid) returns text
language sql stable security definer set search_path = public as $$
  select role from public.project_members where project_id = p and email = public.my_email()
$$;

create or replace function public.is_member(p uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.member_role(p) is not null
$$;

-- Whoever creates a project becomes its superintendent.
create or replace function public.add_project_creator() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.project_members (project_id, email, name, role)
  values (new.id, public.my_email(), coalesce(auth.jwt() -> 'user_metadata' ->> 'name', public.my_email()), 'superintendent');
  return new;
end
$$;

drop trigger if exists projects_add_creator on public.projects;
create trigger projects_add_creator after insert on public.projects
for each row execute function public.add_project_creator();

alter table public.projects enable row level security;
alter table public.project_members enable row level security;

drop policy if exists "members read projects" on public.projects;
create policy "members read projects" on public.projects
  for select to authenticated using (public.is_member(id) or created_by = auth.uid());

drop policy if exists "signed-in users create projects" on public.projects;
create policy "signed-in users create projects" on public.projects
  for insert to authenticated with check (created_by = auth.uid());

drop policy if exists "members see team" on public.project_members;
create policy "members see team" on public.project_members
  for select to authenticated using (public.is_member(project_id));

drop policy if exists "leads add members" on public.project_members;
create policy "leads add members" on public.project_members
  for insert to authenticated
  with check (public.member_role(project_id) in ('superintendent', 'ip', 'facilities', 'safety'));

-- Events (the append-only log) ------------------------------------------------------------

create table if not exists public.events (
  id uuid primary key,
  project_id uuid not null references public.projects (id),
  type text not null,
  payload jsonb not null,
  actor_id uuid not null,
  actor_name text not null,
  actor_email text not null,
  actor_role text not null,
  client_ts timestamptz not null,
  server_ts timestamptz not null default now(),
  device_id text not null,
  prev_hash text not null,
  hash text not null
);

create index if not exists events_project_time on public.events (project_id, client_ts);

create or replace function public.stamp_event() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  r text;
begin
  if new.actor_id is distinct from auth.uid() then
    raise exception 'actor_id must be the signed-in user';
  end if;
  if lower(new.actor_email) is distinct from public.my_email() then
    raise exception 'actor_email must be the signed-in user';
  end if;
  r := public.member_role(new.project_id);
  if r is null then
    raise exception 'not a member of this project';
  end if;
  new.actor_role := r;
  new.server_ts := now();
  return new;
end
$$;

drop trigger if exists events_stamp on public.events;
create trigger events_stamp before insert on public.events
for each row execute function public.stamp_event();

create or replace function public.events_append_only() returns trigger
language plpgsql as $$
begin
  raise exception 'events are append-only';
end
$$;

drop trigger if exists events_no_update on public.events;
create trigger events_no_update before update or delete on public.events
for each row execute function public.events_append_only();

alter table public.events enable row level security;

drop policy if exists "members read events" on public.events;
create policy "members read events" on public.events
  for select to authenticated using (public.is_member(project_id));

drop policy if exists "members append events" on public.events;
create policy "members append events" on public.events
  for insert to authenticated with check (public.is_member(project_id));

-- Live updates to everyone on the project.
do $$
begin
  alter publication supabase_realtime add table public.events;
exception when duplicate_object then null;
end
$$;

-- Photo evidence ---------------------------------------------------------------------------
-- Private bucket; files live at <project id>/<sha256>.jpg and only project members can read them.

insert into storage.buckets (id, name, public)
values ('evidence', 'evidence', false)
on conflict (id) do nothing;

drop policy if exists "members upload evidence" on storage.objects;
create policy "members upload evidence" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'evidence' and public.is_member(((storage.foldername(name))[1])::uuid));

drop policy if exists "members read evidence" on storage.objects;
create policy "members read evidence" on storage.objects
  for select to authenticated
  using (bucket_id = 'evidence' and public.is_member(((storage.foldername(name))[1])::uuid));
