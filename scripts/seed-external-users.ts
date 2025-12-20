/**
 * Seed External Users Script
 * Creates sample external users with proper relationships to subscription_plans
 * 
 * Usage: npx tsx scripts/seed-external-users.ts
 * 
 * Prerequisites:
 * - Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * - Ensure subscription_plans table has: free and pro plans
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

interface SeedUser {
  name: string
  email: string
  password: string
  planSlug: string
  status: 'active' | 'inactive' | 'suspended'
  credits: number
  phoneNumber?: string
  username?: string
  avatarUrl?: string
  isTrial: boolean
  subscriptionStartDate: Date
  subscriptionEndDate: Date
  trialEndsAt?: Date
}

const seedUsers: SeedUser[] = [
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    password: 'SecurePass123!',
    planSlug: 'pro',
    status: 'active',
    credits: 1500,
    phoneNumber: '+919876543210',
    username: 'priyasharma',
    isTrial: false,
    subscriptionStartDate: new Date('2024-01-10T10:00:00Z'),
    subscriptionEndDate: new Date('2025-01-10T10:00:00Z'),
  },
  {
    name: 'Rahul Patel',
    email: 'rahul.patel@example.com',
    password: 'SecurePass123!',
    planSlug: 'pro',
    status: 'active',
    credits: 500,
    phoneNumber: '+919876543211',
    username: 'rahulpatel',
    isTrial: true,
    subscriptionStartDate: new Date('2024-01-15T09:00:00Z'),
    subscriptionEndDate: new Date('2025-01-15T09:00:00Z'),
    trialEndsAt: new Date('2024-01-22T09:00:00Z'),
  },
  {
    name: 'Ananya Reddy',
    email: 'ananya.reddy@example.com',
    password: 'SecurePass123!',
    planSlug: 'pro',
    status: 'active',
    credits: 5000,
    phoneNumber: '+919876543212',
    username: 'ananyareddy',
    isTrial: false,
    subscriptionStartDate: new Date('2023-12-01T08:00:00Z'),
    subscriptionEndDate: new Date('2024-12-01T08:00:00Z'),
  },
  {
    name: 'Arjun Singh',
    email: 'arjun.singh@example.com',
    password: 'SecurePass123!',
    planSlug: 'free',
    status: 'active',
    credits: 100,
    username: 'arjunsingh',
    isTrial: false,
    subscriptionStartDate: new Date('2024-01-20T14:00:00Z'),
    subscriptionEndDate: new Date('2025-01-20T14:00:00Z'),
  },
  {
    name: 'Kavya Nair',
    email: 'kavya.nair@example.com',
    password: 'SecurePass123!',
    planSlug: 'pro',
    status: 'inactive',
    credits: 250,
    phoneNumber: '+919876543213',
    isTrial: false,
    subscriptionStartDate: new Date('2023-11-15T12:00:00Z'),
    subscriptionEndDate: new Date('2024-11-15T12:00:00Z'),
  },
  {
    name: 'Vikram Kumar',
    email: 'vikram.kumar@example.com',
    password: 'SecurePass123!',
    planSlug: 'pro',
    status: 'suspended',
    credits: 800,
    phoneNumber: '+919876543214',
    username: 'vikramkumar',
    isTrial: false,
    subscriptionStartDate: new Date('2024-01-05T11:00:00Z'),
    subscriptionEndDate: new Date('2025-01-05T11:00:00Z'),
  },
  {
    name: 'Meera Iyer',
    email: 'meera.iyer@example.com',
    password: 'SecurePass123!',
    planSlug: 'free',
    status: 'active',
    credits: 300,
    phoneNumber: '+919876543215',
    isTrial: false,
    subscriptionStartDate: new Date('2024-01-18T16:00:00Z'),
    subscriptionEndDate: new Date('2025-01-18T16:00:00Z'),
  },
  {
    name: 'Aditya Desai',
    email: 'aditya.desai@example.com',
    password: 'SecurePass123!',
    planSlug: 'pro',
    status: 'active',
    credits: 10000,
    phoneNumber: '+919876543216',
    username: 'adityadesai',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    isTrial: false,
    subscriptionStartDate: new Date('2023-10-01T09:00:00Z'),
    subscriptionEndDate: new Date('2024-10-01T09:00:00Z'),
  },
  {
    name: 'Sneha Menon',
    email: 'sneha.menon@example.com',
    password: 'SecurePass123!',
    planSlug: 'pro',
    status: 'active',
    credits: 750,
    phoneNumber: '+919876543217',
    username: 'snehamenon',
    isTrial: false,
    subscriptionStartDate: new Date('2024-01-12T13:00:00Z'),
    subscriptionEndDate: new Date('2025-01-12T13:00:00Z'),
  },
  {
    name: 'Rohan Joshi',
    email: 'rohan.joshi@example.com',
    password: 'SecurePass123!',
    planSlug: 'free',
    status: 'active',
    credits: 50,
    isTrial: false,
    subscriptionStartDate: new Date('2024-01-25T10:00:00Z'),
    subscriptionEndDate: new Date('2025-01-25T10:00:00Z'),
  },
]

async function getPlanId(slug: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('subscription_plans')
    .select('id')
    .eq('slug', slug)
    .single()

  if (error) {
    console.warn(`Warning: Plan "${slug}" not found:`, error.message)
    return null
  }

  return data?.id || null
}

async function seedExternalUsers() {
  console.log('Starting external users seeding...\n')

  let successCount = 0
  let errorCount = 0

  for (const seedUser of seedUsers) {
    try {
      console.log(`Creating user: ${seedUser.name} (${seedUser.email})...`)

      // Get plan ID
      const planId = await getPlanId(seedUser.planSlug)
      if (!planId) {
        console.warn(`  ⚠️  Skipping - Plan "${seedUser.planSlug}" not found`)
        errorCount++
        continue
      }

      // Create user in auth.users
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: seedUser.email,
        password: seedUser.password,
        email_confirm: true,
        user_metadata: {
          full_name: seedUser.name,
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          console.log(`  ⚠️  User already exists, skipping...`)
          errorCount++
          continue
        }
        throw authError
      }

      if (!authData.user) {
        throw new Error('User not created in auth system')
      }

      // Wait for profile trigger
      await new Promise(resolve => setTimeout(resolve, 500))

      // Update profile with all fields
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({
          full_name: seedUser.name,
          internal_role: null, // External user
          subscription_plan_id: planId,
          subscription_status: seedUser.isTrial ? 'trial' : 'active',
          subscription_started_at: seedUser.subscriptionStartDate.toISOString(),
          subscription_ends_at: seedUser.subscriptionEndDate.toISOString(),
          status: seedUser.status,
          credits: seedUser.credits,
          phone_number: seedUser.phoneNumber || null,
          username: seedUser.username || null,
          avatar_url: seedUser.avatarUrl || null,
          is_trial: seedUser.isTrial,
          trial_ends_at: seedUser.trialEndsAt ? seedUser.trialEndsAt.toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authData.user.id)

      if (profileError) {
        throw profileError
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
  console.log(`   Errors: ${errorCount}`)
  console.log(`   Total: ${seedUsers.length}`)
}

// Run the seeding
seedExternalUsers()
  .then(() => {
    console.log('\nDone!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

