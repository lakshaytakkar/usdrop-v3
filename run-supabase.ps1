$env:SUPABASE_ACCESS_TOKEN = "sbp_54d16974a6c54bb0e2df52abb1add809e20b45d2"

# Revert remote-only migrations
npx supabase migration repair --status reverted 20251204141358
npx supabase migration repair --status reverted 20251204141700
npx supabase migration repair --status reverted 20251204143429
npx supabase migration repair --status reverted 20251204150113
npx supabase migration repair --status reverted 20251204150116
npx supabase migration repair --status reverted 20251204150127
npx supabase migration repair --status reverted 20251204160844
npx supabase migration repair --status reverted 20251204174236
npx supabase migration repair --status reverted 20251204183205
npx supabase migration repair --status reverted 20251204185006
npx supabase migration repair --status reverted 20251204191552
npx supabase migration repair --status reverted 20251204205621
npx supabase migration repair --status reverted 20251205125221
npx supabase migration repair --status reverted 20251205221244
npx supabase migration repair --status reverted 20251205223203
npx supabase migration repair --status reverted 20251206202743
npx supabase migration repair --status reverted 20251215143606

# Mark local migrations as applied
npx supabase migration repair --status applied 005

# Now push the new migration
npx supabase db push
