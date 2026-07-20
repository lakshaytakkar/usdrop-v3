-- 021_fulfillment_requests.sql
-- Fulfillment Suite (Phase H): merchants ask USDrop's China-warehouse team to
-- fulfill the orders sitting in their connected Shopify store. This table holds
-- those requests. Vendor/warehouse ops are representational for now — statuses
-- are advanced by the team (admin) until a real vendor account is wired.
--
-- Run in the USDrop project's Supabase SQL editor (project wecbybtxmkdkvqqahyuu).
-- Idempotent / additive — safe to re-run.

create table if not exists public.fulfillment_requests (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  store_id            text,
  shopify_order_id    text,
  order_number        text,
  items               jsonb not null default '[]'::jsonb,
  quantity            integer not null default 1,
  destination_country text not null default 'US',
  status              text  not null default 'requested',
  quote_amount        numeric,
  currency            text  not null default 'USD',
  carrier             text,
  tracking_number     text,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Status state machine (representational until vendor is configured).
alter table public.fulfillment_requests
  drop constraint if exists fulfillment_requests_status_check;
alter table public.fulfillment_requests
  add constraint fulfillment_requests_status_check
  check (status in ('requested','quoted','processing','shipped','delivered','cancelled'));

create index if not exists fulfillment_requests_user_created_idx
  on public.fulfillment_requests (user_id, created_at desc);
create index if not exists fulfillment_requests_status_idx
  on public.fulfillment_requests (status);

-- Keep updated_at fresh on every write.
create or replace function public.set_fulfillment_requests_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_fulfillment_requests_updated_at on public.fulfillment_requests;
create trigger trg_fulfillment_requests_updated_at
  before update on public.fulfillment_requests
  for each row execute function public.set_fulfillment_requests_updated_at();
