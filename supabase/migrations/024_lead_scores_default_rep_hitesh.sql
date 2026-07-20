-- 024 · Auto-assign every new USDrop lead to Hitesh (USDrop-only junior sales)
--
-- WHY: Hitesh owns all USDrop leads. Rather than assign case-by-case, default
-- `lead_scores.assigned_rep_id` to Hitesh's HQ rep id on INSERT when it's null.
-- Fires on EVERY creation path (activity-scoring upsert, /api/add-number, admin
-- inserts) so new free leads land in his book automatically.
--
-- Only fires on INSERT → manual reassignment via the CRM UI (an UPDATE) is
-- preserved. Idempotent (drops+recreates the trigger). assigned_rep_id holds an
-- HQ rep id (no FK — team-portal is the rep system of record; see migration 023).
--
-- To change the default rep later, update the constant in the function body.

create or replace function public.lead_scores_default_rep()
returns trigger
language plpgsql
as $$
begin
  if new.assigned_rep_id is null then
    new.assigned_rep_id := '4d1bb27e-144b-48c5-9638-1e0841e01957';  -- Hitesh (hq.profiles.id)
    if new.assigned_at is null then
      new.assigned_at := now();
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_lead_scores_default_rep on public.lead_scores;
create trigger trg_lead_scores_default_rep
  before insert on public.lead_scores
  for each row execute function public.lead_scores_default_rep();
