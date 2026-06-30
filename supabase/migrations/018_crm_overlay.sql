-- 018_crm_overlay.sql
-- USDrop CRM overlay for the Suprans HQ admin rebuild (team.suprans.in/usdrop).
-- ADDITIVE ONLY: new columns, new tables, one read view. No drops, no data edits.
-- Safe to run multiple times (idempotent).
--
-- Run in the USDrop project's Supabase SQL editor (project wecbybtxmkdkvqqahyuu).

-- 1) Overlay columns on the existing lead_scores table. NOTE: the app's own
--    auto_stage / manual_stage_override hold the app's lifecycle values
--    (new_lead / engaged / hot …). The HQ CRM owns a SEPARATE stage column so we
--    never overwrite the app's columns (safe for the live client app).
alter table public.lead_scores add column if not exists crm_stage            text;
alter table public.lead_scores add column if not exists rating               smallint;
alter table public.lead_scores add column if not exists estimated_value_cents bigint;
alter table public.lead_scores add column if not exists tags                  text[] default '{}';
alter table public.lead_scores add column if not exists next_followup_at      timestamptz;
alter table public.lead_scores add column if not exists stage_changed_at      timestamptz;
alter table public.lead_scores add column if not exists assigned_at           timestamptz;

-- 2) Admin notes per user (does not exist today).
create table if not exists public.user_admin_notes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.profiles(id) on delete cascade,
  body            text not null,
  created_by      uuid,
  created_by_name text,
  created_at      timestamptz not null default now()
);
create index if not exists user_admin_notes_user_idx on public.user_admin_notes (user_id, created_at desc);

-- 3) Follow-up tasks per user (mirrors hq.followups).
create table if not exists public.user_followups (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  note        text,
  due_at      timestamptz,
  assigned_to uuid,
  status      text not null default 'open',   -- open | done
  done_at     timestamptz,
  created_by  uuid,
  created_at  timestamptz not null default now()
);
create index if not exists user_followups_user_idx on public.user_followups (user_id, due_at);
create index if not exists user_followups_open_idx on public.user_followups (status, due_at) where status = 'open';

-- 4) Read view: free users joined with their lead_scores overlay, with computed
--    stage/grade so the CRM list can filter/sort/paginate server-side.
create or replace view public.crm_free_leads as
select
  p.id,
  p.full_name,
  p.email,
  p.phone_number,
  p.preferred_niche,
  p.ecommerce_experience,
  p.credits,
  p.subscription_status,
  p.onboarding_progress,
  p.onboarding_completed,
  p.created_at,
  coalesce(ls.crm_stage, 'new') as stage,            -- HQ CRM sales stage (rep-owned)
  ls.auto_stage    as app_stage,                     -- the app's own lifecycle (read-only context)
  ls.engagement_level,
  case lower(coalesce(ls.engagement_level, ''))
    when 'hot'  then 'A'
    when 'warm' then 'B'
    when 'cold' then 'C'
    else 'D'
  end as grade,
  ls.score,
  ls.total_page_views,
  ls.last_activity_at,
  ls.assigned_rep_id,
  ls.assigned_at,
  ls.rating,
  ls.estimated_value_cents,
  coalesce(ls.tags, '{}') as tags,
  ls.next_followup_at,
  ls.stage_changed_at,
  ls.notes,
  ls.free_lessons_completed                           -- free-training progress (sales signal)
from public.profiles p
left join public.lead_scores ls on ls.user_id = p.id
where p.account_type = 'free';
