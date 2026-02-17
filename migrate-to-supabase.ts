import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

function readJsonl(file: string) {
  const content = readFileSync(`/tmp/migration/${file}`, 'utf-8').trim()
  if (!content) return []
  return content.split('\n').map(line => {
    const fixed = line.replace(/\\\\/g, '\\')
    return JSON.parse(fixed)
  })
}

function parseJsonFields(obj: any): any {
  const result = { ...obj }
  for (const [key, val] of Object.entries(result)) {
    if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
      try { result[key] = JSON.parse(val) } catch {}
    }
  }
  return result
}

const profilesData = [
  { id: '2454c9a8-9eb8-4c3d-bd57-6c08bcb92810', email: 'admin@usdrop.ai', full_name: 'Admin User', account_type: 'free', internal_role: 'admin', status: 'active' },
  { id: '6a108fac-ed0f-4449-8c24-e2e2a371da57', email: 'seller@usdrop.ai', full_name: 'Pro Seller', account_type: 'pro', internal_role: null, status: 'active', subscription_plan_id: 'c5a96e6c-9685-47b1-9126-5970e1db743e' },
  { id: '1ea465f3-541f-48d3-8c5f-9658ca7693cb', email: 'free@usdrop.ai', full_name: 'Free User', account_type: 'free', internal_role: null, status: 'active', subscription_plan_id: 'c75d0e18-bbc3-4991-8395-be0127c7c326' },
  { id: 'be47f832-5b5f-45e6-ba59-63afdeff5915', email: 'parthiv.kataria@usdrop.ai', full_name: 'Parthiv Kataria', account_type: 'free', internal_role: 'admin', status: 'active' },
]

async function upsertBatch(table: string, data: any[], batchSize = 50) {
  if (!data.length) { console.log(`  ${table}: 0 rows (skipped)`); return }
  let total = 0
  for (let i = 0; i < data.length; i += batchSize) {
    const batch = data.slice(i, i + batchSize).map(parseJsonFields)
    const { error } = await supabase.from(table).upsert(batch, { onConflict: 'id' })
    if (error) {
      console.error(`  ${table} batch ${i}: ${error.message}`)
    } else {
      total += batch.length
    }
  }
  console.log(`  ${table}: ${total} rows inserted`)
}

async function main() {
  console.log('=== Migrating data to Supabase (phase 2) ===\n')

  console.log('1. Inserting subscription plans...')
  const plans = readJsonl('subscription_plans.jsonl')
  await upsertBatch('subscription_plans', plans)

  console.log('\n2. Updating profiles...')
  for (const profile of profilesData) {
    const { error } = await supabase.from('profiles').update({
      full_name: profile.full_name,
      account_type: profile.account_type,
      internal_role: profile.internal_role,
      status: profile.status,
      subscription_plan_id: (profile as any).subscription_plan_id || null,
    }).eq('id', profile.id)
    if (error) {
      console.error(`  Profile ${profile.email}: ${error.message}`)
    } else {
      console.log(`  Profile ${profile.email}: updated`)
    }
  }

  console.log('\n3. Inserting categories...')
  await upsertBatch('categories', readJsonl('categories.jsonl'))

  console.log('\n4. Inserting products...')
  await upsertBatch('products', readJsonl('products.jsonl'))

  console.log('\n5. Inserting product metadata...')
  await upsertBatch('product_metadata', readJsonl('product_metadata.jsonl'))

  console.log('\n6. Inserting product source...')
  await upsertBatch('product_source', readJsonl('product_source.jsonl'))

  console.log('\n7. Inserting product research...')
  await upsertBatch('product_research', readJsonl('product_research.jsonl'))

  console.log('\n8. Inserting competitor stores...')
  await upsertBatch('competitor_stores', readJsonl('competitor_stores.jsonl'))

  console.log('\n9. Inserting courses...')
  const courses = readJsonl('courses.jsonl').map((c: any) => ({...c, instructor_id: null}))
  await upsertBatch('courses', courses)

  console.log('\n10. Inserting course modules...')
  await upsertBatch('course_modules', readJsonl('course_modules.jsonl'))

  console.log('\n11. Inserting onboarding modules...')
  await upsertBatch('onboarding_modules', readJsonl('onboarding_modules.jsonl'))

  console.log('\n12. Inserting onboarding videos...')
  await upsertBatch('onboarding_videos', readJsonl('onboarding_videos.jsonl'))

  console.log('\n=== Migration complete! ===')

  const { count: catCount } = await supabase.from('categories').select('*', { count: 'exact', head: true })
  const { count: prodCount } = await supabase.from('products').select('*', { count: 'exact', head: true })
  const { count: courseCount } = await supabase.from('courses').select('*', { count: 'exact', head: true })
  const { count: profCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
  const { count: metaCount } = await supabase.from('product_metadata').select('*', { count: 'exact', head: true })
  const { count: compCount } = await supabase.from('competitor_stores').select('*', { count: 'exact', head: true })

  console.log(`\nVerification:`)
  console.log(`  Profiles: ${profCount}`)
  console.log(`  Categories: ${catCount}`)
  console.log(`  Products: ${prodCount}`)
  console.log(`  Product Metadata: ${metaCount}`)
  console.log(`  Courses: ${courseCount}`)
  console.log(`  Competitor Stores: ${compCount}`)
}

main().catch(console.error)
