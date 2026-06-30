-- 020_support_tickets_types.sql
-- Allow 'bug' and 'feature_request' as support_ticket types so the client
-- "Report a bug / feedback" widget can file them (triaged in HQ → USDrop → Bug
-- Reports). Additive to the existing allowed types. Safe.
--
-- Run in the USDrop project's Supabase SQL editor (project wecbybtxmkdkvqqahyuu).

-- Drop whatever the current type CHECK constraint is named (handles unknown name).
do $$
declare c text;
begin
  select conname into c
    from pg_constraint
   where conrelid = 'public.support_tickets'::regclass
     and contype = 'c'
     and pg_get_constraintdef(oid) ilike '%type%';
  if c is not null then
    execute format('alter table public.support_tickets drop constraint %I', c);
  end if;
end $$;

alter table public.support_tickets
  add constraint support_tickets_type_check
  check (type in ('bug', 'feature_request', 'technical', 'billing', 'account', 'content', 'other'));
