-- 023 · Drop the FK on lead_scores.assigned_rep_id
--
-- WHY: USDrop free users surface as leads in the HQ CRM (team.suprans.in
-- /usdrop/leads), which reads the usdrop `crm_free_leads` view but resolves the
-- OWNING REP from the workspace DB (hq.profiles) — the rep's id arrives as the
-- `x-sup-actor` header (an hq.profiles.id). So `lead_scores.assigned_rep_id`
-- must hold an HQ rep id, which by definition does NOT exist in the usdrop
-- `profiles` table. The original FK (assigned_rep_id -> public.profiles.id) is
-- therefore architecturally wrong and blocks every assignment
-- (fails: "Key (assigned_rep_id)=... is not present in table profiles").
--
-- FIX: drop the FK. `assigned_rep_id` becomes a plain uuid holding the HQ rep
-- id. No cross-DB FK is possible; ownership integrity is enforced by the CRM
-- app (team-portal), which is the system of record for reps.
--
-- Safe + idempotent. After applying, the HQ→usdrop lead-assignment bridge can
-- assign free users to any HQ rep (e.g. Hitesh, the USDrop-only junior sales).

do $$
declare
  c record;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.lead_scores'::regclass
      and contype = 'f'
      and pg_get_constraintdef(oid) ilike '%assigned_rep_id%'
  loop
    execute format('alter table public.lead_scores drop constraint %I', c.conname);
    raise notice 'dropped constraint %', c.conname;
  end loop;
end $$;

comment on column public.lead_scores.assigned_rep_id is
  'HQ rep id (hq.profiles.id from the workspace DB). No FK — cross-project; ownership is enforced by the team-portal CRM.';
