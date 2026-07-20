-- 022_store_build_requests.sql
-- Phase I — "Build Your Store" (Elite). A guided flow where the user picks a
-- niche + brand basics and USDrop builds them a done-for-you Shopify store
-- (theme + winning products + ready-to-sell pages). Real Shopify-Partner
-- provisioning is deferred — our team provisions + delivers; status advances
-- requested -> building -> ready -> delivered.
--
-- Run in the USDrop project's Supabase SQL editor (project wecbybtxmkdkvqqahyuu).
-- Idempotent / additive — safe to re-run.

create table if not exists public.store_build_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles(id) on delete cascade,
  niche         text not null,
  store_name    text,
  tagline       text,
  brand_color   text,
  products_count integer not null default 10,
  status        text not null default 'requested',
  store_url     text,
  store_login   text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

alter table public.store_build_requests
  drop constraint if exists store_build_requests_status_check;
alter table public.store_build_requests
  add constraint store_build_requests_status_check
  check (status in ('requested','building','ready','delivered','cancelled'));

create index if not exists store_build_requests_user_created_idx
  on public.store_build_requests (user_id, created_at desc);

create or replace function public.set_store_build_requests_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_store_build_requests_updated_at on public.store_build_requests;
create trigger trg_store_build_requests_updated_at
  before update on public.store_build_requests
  for each row execute function public.set_store_build_requests_updated_at();
