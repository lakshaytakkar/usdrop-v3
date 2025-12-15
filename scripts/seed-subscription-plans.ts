/**
 * Seed Subscription Plans Script
 * Creates sample subscription plans with proper structure
 * 
 * Usage: npx tsx scripts/seed-subscription-plans.ts
 * 
 * Prerequisites:
 * - Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
          process.env[key.trim()] = value
        }
      }
    })
  }
}

loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  console.error('Current directory:', process.cwd())
  console.error('Looking for .env.local at:', path.join(process.cwd(), '.env.local'))
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

interface SeedPlan {
  name: string
  slug: string
  description: string | null
  priceMonthly: number
  priceAnnual: number | null
  priceYearly: number | null
  features: string[]
  popular: boolean
  active: boolean
  isPublic: boolean
  displayOrder: number
  keyPointers: string | null
  trialDays: number
}

const seedPlans: SeedPlan[] = [
  {
    name: 'Free',
    slug: 'free',
    description: 'Basic features for getting started',
    priceMonthly: 0,
    priceAnnual: null,
    priceYearly: null,
    features: [
      'Basic product access',
      'Limited searches (10/month)',
      'Community support',
      'Basic analytics',
    ],
    popular: false,
    active: true,
    isPublic: true,
    displayOrder: 1,
    keyPointers: null,
    trialDays: 0,
  },
  {
    name: 'Pro',
    slug: 'pro',
    description: 'Advanced features for growing businesses',
    priceMonthly: 999,
    priceAnnual: 9999,
    priceYearly: 9999,
    features: [
      'Unlimited product access',
      'Unlimited searches',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Export capabilities',
    ],
    popular: true,
    active: true,
    isPublic: true,
    displayOrder: 2,
    keyPointers: 'Best for small businesses',
    trialDays: 7,
  },
  {
    name: 'Premium',
    slug: 'premium',
    description: 'Complete solution for established businesses',
    priceMonthly: 2499,
    priceAnnual: 24999,
    priceYearly: 24999,
    features: [
      'Everything in Pro',
      'White-label options',
      'Dedicated support',
      'Custom integrations',
      'Advanced reporting',
      'Team collaboration',
      'Custom branding',
    ],
    popular: false,
    active: true,
    isPublic: true,
    displayOrder: 3,
    keyPointers: 'Best for growing teams',
    trialDays: 14,
  },
  {
    name: 'Enterprise',
    slug: 'enterprise',
    description: 'Enterprise-grade solution with custom features',
    priceMonthly: 9999,
    priceAnnual: 99999,
    priceYearly: 99999,
    features: [
      'Everything in Premium',
      'Custom feature development',
      'Dedicated account manager',
      'SLA guarantee',
      'On-premise deployment option',
      'Advanced security features',
      'Custom training',
    ],
    popular: false,
    active: true,
    isPublic: false,
    displayOrder: 4,
    keyPointers: 'Best for large organizations',
    trialDays: 30,
  },
]

async function checkPlanExists(slug: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('subscription_plans')
    .select('id')
    .eq('slug', slug)
    .single()

  if (error && error.code !== 'PGRST116') {
    console.warn(`Warning: Error checking plan "${slug}":`, error.message)
    return false
  }

  return !!data
}

async function seedSubscriptionPlans() {
  console.log('Starting subscription plans seeding...\n')

  let successCount = 0
  let skippedCount = 0
  let errorCount = 0

  for (const seedPlan of seedPlans) {
    try {
      console.log(`Creating plan: ${seedPlan.name} (${seedPlan.slug})...`)

      // Check if plan already exists
      const exists = await checkPlanExists(seedPlan.slug)
      if (exists) {
        console.log(`  ⚠️  Plan "${seedPlan.slug}" already exists, skipping...`)
        skippedCount++
        continue
      }

      // Insert plan
      const { data, error } = await supabaseAdmin
        .from('subscription_plans')
        .insert({
          name: seedPlan.name,
          slug: seedPlan.slug,
          description: seedPlan.description,
          price_monthly: seedPlan.priceMonthly,
          price_annual: seedPlan.priceAnnual,
          price_yearly: seedPlan.priceYearly,
          features: seedPlan.features,
          popular: seedPlan.popular,
          active: seedPlan.active,
          is_public: seedPlan.isPublic,
          display_order: seedPlan.displayOrder,
          key_pointers: seedPlan.keyPointers,
          trial_days: seedPlan.trialDays,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      console.log(`  ✅ Created successfully`)
      successCount++
    } catch (error: any) {
      console.error(`  ❌ Error: ${error.message}`)
      errorCount++
    }
  }

  console.log(`\n✅ Seeding complete!`)
  console.log(`   Success: ${successCount}`)
  console.log(`   Skipped: ${skippedCount}`)
  console.log(`   Errors: ${errorCount}`)
  console.log(`   Total: ${seedPlans.length}`)
}

// Run the seeding
seedSubscriptionPlans()
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

