-- 019_crm_free_leads_lessons.sql
-- Adds free_lessons_completed to the crm_free_leads view (the free-training sales
-- signal: "X/19 lessons → ready to sell"). DROP + CREATE avoids the
-- "cannot change name of view column" error that CREATE OR REPLACE throws when a
-- column is inserted mid-list. Safe: nothing else depends on this view.
--
-- Run in the USDrop project's Supabase SQL editor (project wecbybtxmkdkvqqahyuu).

drop view if exists public.crm_free_leads;

create view public.crm_free_leads as
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
  coalesce(ls.crm_stage, 'new') as stage,
  ls.auto_stage as app_stage,
  ls.engagement_level,
  case lower(coalesce(ls.engagement_level, ''))
    when 'hot'  then 'A'
    when 'warm' then 'B'
    when 'cold' then 'C'
    else 'D'
  end as grade,
  ls.score,
  ls.free_lessons_completed,
  ls.total_page_views,
  ls.last_activity_at,
  ls.assigned_rep_id,
  ls.assigned_at,
  ls.rating,
  ls.estimated_value_cents,
  coalesce(ls.tags, '{}') as tags,
  ls.next_followup_at,
  ls.stage_changed_at,
  ls.notes
from public.profiles p
left join public.lead_scores ls on ls.user_id = p.id
where p.account_type = 'free';
