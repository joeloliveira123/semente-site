create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  starts_at timestamptz not null,
  location text,
  image_path text,
  link_url text,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.events enable row level security;

grant select on public.events to anon, authenticated;

create policy "Public can read published events"
  on public.events
  for select
  to anon, authenticated
  using (is_published = true);

insert into storage.buckets (id, name, public)
values ('event-images', 'event-images', true)
on conflict (id) do update set public = true;

create policy "Public can view event images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'event-images');
