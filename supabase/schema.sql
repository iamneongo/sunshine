create extension if not exists pgcrypto;

create table if not exists public.sales_leads (
  id text primary key,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  project_name text not null,
  source text not null,
  full_name text not null default '',
  phone text not null default '',
  zalo text not null default '',
  email text not null default '',
  need text not null default 'Chưa rõ',
  budget text not null default 'Chưa rõ',
  contact_preference text not null default 'Chưa rõ',
  hotness text not null default 'Lạnh',
  status text not null default 'Chưa gọi',
  tags jsonb not null default '[]'::jsonb,
  notes text not null default '',
  preferred_callback_time text not null default '',
  preferred_visit_time text not null default '',
  travel_party text not null default '',
  last_message text not null default '',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists sales_leads_updated_at_idx on public.sales_leads (updated_at desc);
create index if not exists sales_leads_hotness_idx on public.sales_leads (hotness);
create index if not exists sales_leads_status_idx on public.sales_leads (status);
create index if not exists sales_leads_source_idx on public.sales_leads (source);

create table if not exists public.sales_events (
  id text primary key,
  created_at timestamptz not null default timezone('utc', now()),
  name text not null,
  source text not null,
  lead_id text not null default '',
  session_id text not null default '',
  path text not null default '',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists sales_events_created_at_idx on public.sales_events (created_at desc);
create index if not exists sales_events_name_idx on public.sales_events (name);
create index if not exists sales_events_source_idx on public.sales_events (source);

alter table public.sales_leads enable row level security;
alter table public.sales_events enable row level security;

drop policy if exists "Service role can manage sales_leads" on public.sales_leads;
create policy "Service role can manage sales_leads"
  on public.sales_leads
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage sales_events" on public.sales_events;
create policy "Service role can manage sales_events"
  on public.sales_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
