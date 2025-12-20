import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function seedUsers() {
  console.log('Starting user seeding...')

  // Get plan IDs
  const { data: plans, error: plansError } = await supabase
    .from('subscription_plans')
    .select('id, slug, name')

  if (plansError) {
    console.error('Error fetching plans:', plansError)
    return
  }

  console.log('Available plans:', plans)

  const freePlan = plans?.find(p => p.slug === 'free')
  const proPlan = plans?.find(p => p.slug === 'pro')

  if (!freePlan) {
    console.error('Free plan not found!')
    return
  }

  if (!proPlan) {
    console.error('Pro plan not found!')
    return
  }

  // Create Pro User
  console.log('\n--- Creating Pro User ---')
  const proUserEmail = 'pro.user@usdrop.ai'
  const proUserPassword = 'ProUser123!'

  const { data: proAuthData, error: proAuthError } = await supabase.auth.admin.createUser({
    email: proUserEmail,
    password: proUserPassword,
    email_confirm: true,
    user_metadata: {
      full_name: 'Pro Test User',
    },
  })

  if (proAuthError) {
    if (proAuthError.message.includes('already been registered')) {
      console.log('Pro user already exists, skipping auth creation...')
    } else {
      console.error('Error creating pro auth user:', proAuthError)
      return
    }
  } else {
    console.log('Pro auth user created:', proAuthData.user?.id)

    // Wait for trigger
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update profile with pro plan
    const startDate = new Date()
    const endDate = new Date()
    endDate.setFullYear(endDate.getFullYear() + 1) // 1 year subscription

    const { error: proProfileError } = await supabase
      .from('profiles')
      .update({
        full_name: 'Pro Test User',
        internal_role: null,
        subscription_plan_id: proPlan.id,
        subscription_status: 'active',
        subscription_started_at: startDate.toISOString(),
        subscription_ends_at: endDate.toISOString(),
        status: 'active',
        credits: 1000,
        is_trial: false,
        onboarding_completed: true,
      })
      .eq('id', proAuthData.user!.id)

    if (proProfileError) {
      console.error('Error updating pro profile:', proProfileError)
    } else {
      console.log('Pro user profile updated successfully!')
    }
  }

  // Create Free User
  console.log('\n--- Creating Free User ---')
  const freeUserEmail = 'free.user@usdrop.ai'
  const freeUserPassword = 'FreeUser123!'

  const { data: freeAuthData, error: freeAuthError } = await supabase.auth.admin.createUser({
    email: freeUserEmail,
    password: freeUserPassword,
    email_confirm: true,
    user_metadata: {
      full_name: 'Free Test User',
    },
  })

  if (freeAuthError) {
    if (freeAuthError.message.includes('already been registered')) {
      console.log('Free user already exists, skipping auth creation...')
    } else {
      console.error('Error creating free auth user:', freeAuthError)
      return
    }
  } else {
    console.log('Free auth user created:', freeAuthData.user?.id)

    // Wait for trigger
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update profile with free plan
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1) // 1 month

    const { error: freeProfileError } = await supabase
      .from('profiles')
      .update({
        full_name: 'Free Test User',
        internal_role: null,
        subscription_plan_id: freePlan.id,
        subscription_status: 'active',
        subscription_started_at: startDate.toISOString(),
        subscription_ends_at: endDate.toISOString(),
        status: 'active',
        credits: 10,
        is_trial: false,
        onboarding_completed: true,
      })
      .eq('id', freeAuthData.user!.id)

    if (freeProfileError) {
      console.error('Error updating free profile:', freeProfileError)
    } else {
      console.log('Free user profile updated successfully!')
    }
  }

  console.log('\n=== User Seeding Complete ===')
  console.log('\nCredentials:')
  console.log('---')
  console.log('Pro User:')
  console.log(`  Email: ${proUserEmail}`)
  console.log(`  Password: ${proUserPassword}`)
  console.log('---')
  console.log('Free User:')
  console.log(`  Email: ${freeUserEmail}`)
  console.log(`  Password: ${freeUserPassword}`)
}

seedUsers().catch(console.error)
