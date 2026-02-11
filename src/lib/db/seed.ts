import postgres from 'postgres'
import bcrypt from 'bcryptjs'

const SUPABASE_URL = 'https://znddcikjgrvmltruuvca.supabase.co/rest/v1'
const SUPABASE_KEY = 'sb_publishable_Y-5ueabqP07OsXwTCiCaKA_MTcsLS-h'

const sql = postgres(process.env.DATABASE_URL!, {
  max: 5,
  idle_timeout: 20,
  connect_timeout: 10,
})

const HEADERS = {
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

const JSONB_COLUMNS: Record<string, string[]> = {
  subscription_plans: ['features', 'key_pointers'],
  categories: [],
  products: ['additional_images', 'specifications', 'trend_data'],
  product_source: [],
  product_metadata: ['revenue_trend', 'detailed_analysis', 'filters'],
  product_research: ['competitor_pricing', 'audience_targeting', 'social_proof'],
  competitor_stores: [],
  courses: ['tags', 'learning_objectives', 'prerequisites'],
  course_modules: ['content'],
  onboarding_modules: [],
  onboarding_videos: [],
}

const TABLES_IN_ORDER = [
  'subscription_plans',
  'categories',
  'products',
  'product_source',
  'product_metadata',
  'product_research',
  'competitor_stores',
  'courses',
  'course_modules',
  'onboarding_modules',
  'onboarding_videos',
]

async function fetchFromSupabase(table: string): Promise<any[]> {
  const url = `${SUPABASE_URL}/${table}?select=*`
  const response = await fetch(url, { headers: HEADERS })
  if (!response.ok) {
    console.error(`Failed to fetch ${table}: ${response.status} ${response.statusText}`)
    return []
  }
  return response.json()
}

function processRow(row: any, jsonbCols: string[]): any {
  const processed: any = {}
  for (const [key, value] of Object.entries(row)) {
    if (jsonbCols.includes(key) && value !== null && typeof value === 'object') {
      processed[key] = JSON.stringify(value)
    } else {
      processed[key] = value
    }
  }
  return processed
}

async function importTable(table: string) {
  console.log(`\n📦 Importing ${table}...`)
  const rows = await fetchFromSupabase(table)
  if (rows.length === 0) {
    console.log(`  ⚠️  No rows found for ${table}`)
    return
  }
  console.log(`  📥 Fetched ${rows.length} rows from Supabase`)

  const jsonbCols = JSONB_COLUMNS[table] || []
  let inserted = 0

  for (const row of rows) {
    const processed = processRow(row, jsonbCols)
    const columns = Object.keys(processed)
    const values = Object.values(processed)

    try {
      const colNames = columns.map(c => `"${c}"`).join(', ')
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ')
      await sql.unsafe(
        `INSERT INTO ${table} (${colNames}) VALUES (${placeholders}) ON CONFLICT DO NOTHING`,
        values as any[]
      )
      inserted++
    } catch (err: any) {
      console.error(`  ❌ Error inserting row in ${table}: ${err.message}`)
    }
  }

  console.log(`  ✅ Inserted ${inserted}/${rows.length} rows into ${table}`)
}

async function createTestUsers() {
  console.log('\n👤 Creating test users...')

  const adminHash = await bcrypt.hash('Admin123!', 12)
  const sellerHash = await bcrypt.hash('Seller123!', 12)
  const freeHash = await bcrypt.hash('Free123!', 12)
  const existingAdminHash = await bcrypt.hash('USDrop2024!', 12)

  const proPlans = await sql`SELECT id FROM subscription_plans WHERE slug = 'pro' LIMIT 1`
  const freePlans = await sql`SELECT id FROM subscription_plans WHERE slug = 'free' LIMIT 1`

  const proPlanId = proPlans.length > 0 ? proPlans[0].id : null
  const freePlanId = freePlans.length > 0 ? freePlans[0].id : null

  console.log(`  Pro plan ID: ${proPlanId || 'not found'}`)
  console.log(`  Free plan ID: ${freePlanId || 'not found'}`)

  try {
    await sql`
      INSERT INTO profiles (email, password_hash, full_name, internal_role, account_type, status)
      VALUES (${'admin@usdrop.ai'}, ${adminHash}, ${'Admin User'}, ${'admin'}, ${'free'}, ${'active'})
      ON CONFLICT (email) DO UPDATE SET password_hash = ${adminHash}, internal_role = 'admin'
    `
    console.log('  ✅ Admin user created/updated')
  } catch (err: any) {
    console.error(`  ❌ Error creating admin: ${err.message}`)
  }

  try {
    await sql`
      INSERT INTO profiles (email, password_hash, full_name, internal_role, account_type, status, subscription_plan_id)
      VALUES (${'seller@usdrop.ai'}, ${sellerHash}, ${'Pro Seller'}, ${null}, ${'pro'}, ${'active'}, ${proPlanId})
      ON CONFLICT (email) DO UPDATE SET password_hash = ${sellerHash}, account_type = 'pro', subscription_plan_id = ${proPlanId}
    `
    console.log('  ✅ Pro Seller user created/updated')
  } catch (err: any) {
    console.error(`  ❌ Error creating seller: ${err.message}`)
  }

  try {
    await sql`
      INSERT INTO profiles (email, password_hash, full_name, internal_role, account_type, status, subscription_plan_id)
      VALUES (${'free@usdrop.ai'}, ${freeHash}, ${'Free User'}, ${null}, ${'free'}, ${'active'}, ${freePlanId})
      ON CONFLICT (email) DO UPDATE SET password_hash = ${freeHash}, account_type = 'free', subscription_plan_id = ${freePlanId}
    `
    console.log('  ✅ Free User created/updated')
  } catch (err: any) {
    console.error(`  ❌ Error creating free user: ${err.message}`)
  }

  try {
    await sql`
      INSERT INTO profiles (email, password_hash, full_name, internal_role, account_type, status)
      VALUES (${'parthiv.kataria@usdrop.ai'}, ${existingAdminHash}, ${'Parthiv Kataria'}, ${'admin'}, ${'free'}, ${'active'})
      ON CONFLICT (email) DO UPDATE SET password_hash = ${existingAdminHash}, internal_role = 'admin'
    `
    console.log('  ✅ Existing admin user (parthiv.kataria@usdrop.ai) migrated')
  } catch (err: any) {
    console.error(`  ❌ Error migrating existing admin: ${err.message}`)
  }
}

async function main() {
  console.log('🚀 Starting database seed...\n')
  console.log('='.repeat(50))

  for (const table of TABLES_IN_ORDER) {
    await importTable(table)
  }

  console.log('\n' + '='.repeat(50))
  await createTestUsers()

  console.log('\n' + '='.repeat(50))
  console.log('\n📊 Final counts:')
  const counts = await sql`
    SELECT 'profiles' as table_name, COUNT(*)::int as cnt FROM profiles
    UNION ALL SELECT 'products', COUNT(*)::int FROM products
    UNION ALL SELECT 'categories', COUNT(*)::int FROM categories
    UNION ALL SELECT 'subscription_plans', COUNT(*)::int FROM subscription_plans
    UNION ALL SELECT 'courses', COUNT(*)::int FROM courses
    UNION ALL SELECT 'competitor_stores', COUNT(*)::int FROM competitor_stores
  `
  for (const row of counts) {
    console.log(`  ${row.table_name}: ${row.cnt}`)
  }

  console.log('\n✅ Seed complete!')
  await sql.end()
  process.exit(0)
}

main().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
