import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function main() {
  console.log('🗑️  Clearing product_research table...')

  // Count existing records
  const { count } = await supabase
    .from('product_research')
    .select('*', { count: 'exact', head: true })

  console.log(`📊 Current records: ${count}`)

  if (!count || count === 0) {
    console.log('✅ Table is already empty')
    process.exit(0)
  }

  // Delete all records - use not.is.null on product_id to match all
  const { error, count: deletedCount } = await supabase
    .from('product_research')
    .delete({ count: 'exact' })
    .not('product_id', 'is', null)

  if (error) {
    console.error('❌ Delete error:', error.message)
    process.exit(1)
  }

  console.log(`🗑️  Deleted ${deletedCount} records`)

  // Verify
  const { count: remaining } = await supabase
    .from('product_research')
    .select('*', { count: 'exact', head: true })

  console.log(`✅ Remaining records: ${remaining}`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
