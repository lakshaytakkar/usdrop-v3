/**
 * Script to create an admin user with superadmin role
 * Usage: npx tsx scripts/create-admin-user.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function createAdminUser() {
  const email = 'admin@usdrop.ai'
  const password = 'Admin123!'
  const name = 'Admin User'
  const role = 'superadmin'
  const status = 'active'

  console.log(`Creating admin user: ${email}...`)

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin
      .from('profiles')
      .select('id, email, internal_role')
      .eq('email', email)
      .single()

    if (existingUsers) {
      console.log(`⚠️  User with email ${email} already exists`)
      console.log(`   User ID: ${existingUsers.id}`)
      console.log(`   Current role: ${existingUsers.internal_role || 'not set'}`)
      
      // Update existing user to superadmin if not already
      if (existingUsers.internal_role !== 'superadmin') {
        console.log(`   Updating role to superadmin...`)
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({
            internal_role: role,
            status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingUsers.id)

        if (updateError) {
          console.error('❌ Error updating user:', updateError.message)
          process.exit(1)
        }
        console.log('✅ User updated to superadmin successfully!')
      } else {
        console.log('✅ User is already a superadmin')
      }
      return
    }

    // Create user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
      },
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`⚠️  User already exists in auth system`)
        // Try to update existing user's profile - use listUsers to find by email
        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
        const user = users.find(u => u.email === email)
        if (user) {
          await new Promise(resolve => setTimeout(resolve, 500))
          const { error: updateError } = await supabaseAdmin
            .from('profiles')
            .update({
              internal_role: role,
              status,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id)

          if (updateError) {
            console.error('❌ Error updating profile:', updateError.message)
            process.exit(1)
          }
          console.log('✅ User profile updated to superadmin successfully!')
        }
        return
      }
      console.error('❌ Error creating auth user:', authError.message)
      process.exit(1)
    }

    if (!authData.user) {
      console.error('❌ User not created in auth system')
      process.exit(1)
    }

    console.log(`✅ Auth user created: ${authData.user.id}`)

    // Wait for profile trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update the profile with internal role
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: name,
        internal_role: role,
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id)
      .select()
      .single()

    if (profileError) {
      console.error('❌ Error updating profile:', profileError.message)
      process.exit(1)
    }

    console.log('✅ Admin user created successfully!')
    console.log('\nUser Details:')
    console.log(`  Email: ${email}`)
    console.log(`  Password: ${password}`)
    console.log(`  Role: ${role}`)
    console.log(`  Status: ${status}`)
    console.log(`  User ID: ${profile.id}`)
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    process.exit(1)
  }
}

createAdminUser()
  .then(() => {
    console.log('\n✅ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })

