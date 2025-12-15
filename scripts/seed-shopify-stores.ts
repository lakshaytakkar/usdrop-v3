/**
 * Seed Shopify Stores Script
 * Creates sample Shopify stores linked to existing external users
 * 
 * Usage: npx tsx scripts/seed-shopify-stores.ts
 * 
 * Prerequisites:
 * - Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * - Ensure profiles table has external users (run seed-external-users.ts first)
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

interface SeedStore {
  name: string
  url: string
  userEmail: string
  status: 'connected' | 'disconnected' | 'syncing' | 'error'
  sync_status: 'success' | 'failed' | 'pending' | 'never'
  products_count: number
  monthly_revenue: number | null
  monthly_traffic: number | null
  niche: string | null
  country: string | null
  currency: string
  plan: 'basic' | 'shopify' | 'advanced' | 'plus'
  connected_at: Date
  last_synced_at: Date | null
}

const seedStores: SeedStore[] = [
  {
    name: 'Fashion Forward',
    url: 'fashionforward.myshopify.com',
    userEmail: 'priya.sharma@example.com',
    status: 'connected',
    sync_status: 'success',
    products_count: 150,
    monthly_revenue: 45000,
    monthly_traffic: 12000,
    niche: 'Fashion',
    country: 'IN',
    currency: 'INR',
    plan: 'shopify',
    connected_at: new Date('2024-01-15T10:30:00Z'),
    last_synced_at: new Date('2024-01-20T14:30:00Z'),
  },
  {
    name: 'Tech Gadgets Hub',
    url: 'techgadgets.myshopify.com',
    userEmail: 'rahul.patel@example.com',
    status: 'connected',
    sync_status: 'success',
    products_count: 320,
    monthly_revenue: 89000,
    monthly_traffic: 25000,
    niche: 'Electronics',
    country: 'IN',
    currency: 'INR',
    plan: 'advanced',
    connected_at: new Date('2024-01-10T14:20:00Z'),
    last_synced_at: new Date('2024-01-20T09:15:00Z'),
  },
  {
    name: 'Home Decor Plus',
    url: 'homedecorplus.myshopify.com',
    userEmail: 'ananya.reddy@example.com',
    status: 'disconnected',
    sync_status: 'failed',
    products_count: 85,
    monthly_revenue: 12000,
    monthly_traffic: 3500,
    niche: 'Home & Decor',
    country: 'IN',
    currency: 'INR',
    plan: 'basic',
    connected_at: new Date('2024-01-05T09:15:00Z'),
    last_synced_at: new Date('2024-01-18T11:20:00Z'),
  },
  {
    name: 'Beauty Essentials',
    url: 'beautyessentials.myshopify.com',
    userEmail: 'priya.sharma@example.com',
    status: 'connected',
    sync_status: 'success',
    products_count: 200,
    monthly_revenue: 65000,
    monthly_traffic: 18000,
    niche: 'Beauty',
    country: 'IN',
    currency: 'INR',
    plan: 'shopify',
    connected_at: new Date('2024-01-20T11:00:00Z'),
    last_synced_at: new Date('2024-01-21T10:00:00Z'),
  },
  {
    name: 'Sports Zone',
    url: 'sportszone.myshopify.com',
    userEmail: 'rahul.patel@example.com',
    status: 'syncing',
    sync_status: 'pending',
    products_count: 95,
    monthly_revenue: 28000,
    monthly_traffic: 8000,
    niche: 'Sports',
    country: 'IN',
    currency: 'INR',
    plan: 'basic',
    connected_at: new Date('2024-01-18T15:30:00Z'),
    last_synced_at: null,
  },
]

async function seedShopifyStores() {
  console.log('Starting Shopify stores seeding...\n')

  // Fetch all external users
  const { data: users, error: usersError } = await supabaseAdmin
    .from('profiles')
    .select('id, email')
    .is('internal_role', null)

  if (usersError) {
    console.error('Error fetching users:', usersError)
    process.exit(1)
  }

  if (!users || users.length === 0) {
    console.error('No external users found. Please run seed-external-users.ts first.')
    process.exit(1)
  }

  console.log(`Found ${users.length} external users\n`)

  let created = 0
  let skipped = 0
  let errors = 0

  for (const store of seedStores) {
    // Find user by email
    const user = users.find(u => u.email === store.userEmail)

    if (!user) {
      console.warn(`⚠️  Skipping store "${store.name}": User "${store.userEmail}" not found`)
      skipped++
      continue
    }

    // Check if store already exists
    const { data: existingStore } = await supabaseAdmin
      .from('shopify_stores')
      .select('id')
      .eq('url', store.url)
      .eq('user_id', user.id)
      .single()

    if (existingStore) {
      console.log(`⏭️  Store "${store.name}" already exists, skipping`)
      skipped++
      continue
    }

    try {
      // Create store
      const { data: newStore, error: createError } = await supabaseAdmin
        .from('shopify_stores')
        .insert({
          user_id: user.id,
          name: store.name,
          url: store.url,
          status: store.status,
          connected_at: store.connected_at.toISOString(),
          last_synced_at: store.last_synced_at?.toISOString() || null,
          sync_status: store.sync_status,
          api_key: `sk_live_${Math.random().toString(36).substring(2, 15)}`,
          access_token: `shpat_${Math.random().toString(36).substring(2, 20)}`,
          products_count: store.products_count,
          monthly_revenue: store.monthly_revenue,
          monthly_traffic: store.monthly_traffic,
          niche: store.niche,
          country: store.country,
          currency: store.currency,
          plan: store.plan,
        })
        .select()
        .single()

      if (createError) {
        console.error(`❌ Error creating store "${store.name}":`, createError.message)
        errors++
        continue
      }

      console.log(`✅ Created store "${store.name}" for user ${store.userEmail}`)
      created++
    } catch (err) {
      console.error(`❌ Unexpected error creating store "${store.name}":`, err)
      errors++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('Seeding Summary:')
  console.log(`✅ Created: ${created}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Errors: ${errors}`)
  console.log('='.repeat(50))
}

seedShopifyStores()
  .then(() => {
    console.log('\n✅ Seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  })

