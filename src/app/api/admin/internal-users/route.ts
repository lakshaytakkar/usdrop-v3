import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/admin/internal-users - List all internal users
export async function GET() {
  try {
    console.log('Fetching users from Supabase...')
    
    // Fetch all users and filter in memory (more reliable than .not() syntax)
    const { data: allUsers, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Supabase error fetching users:', {
        message: fetchError.message,
        details: fetchError,
        code: fetchError.code,
        hint: fetchError.hint,
      })
      return NextResponse.json({ 
        error: fetchError.message || 'Failed to fetch users',
        details: fetchError.code || 'Unknown error',
        hint: fetchError.hint
      }, { status: 500 })
    }

    console.log(`Fetched ${allUsers?.length || 0} total users from database`)

    // Filter for internal users (those with internal_role not null)
    const data = allUsers?.filter(user => user.internal_role !== null) || []
    
    console.log(`Filtered to ${data.length} internal users`)

    if (!data || data.length === 0) {
      console.log('No internal users found, returning empty array')
      return NextResponse.json([])
    }

    // Transform to match InternalUser interface
    const users = data.map((user) => ({
      id: user.id,
      name: user.full_name || '',
      email: user.email,
      role: user.internal_role,
      status: user.status || 'active',
      phoneNumber: user.phone_number || null,
      username: user.username || null,
      avatarUrl: user.avatar_url || null,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    }))

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error in GET /api/admin/internal-users:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ 
      error: errorMessage,
      details: error instanceof Error ? error.stack : String(error)
    }, { status: 500 })
  }
}

// POST /api/admin/internal-users - Create a new internal user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, role, status = 'active', phoneNumber, username, avatarUrl } = body

    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    // Validate role
    const validRoles = ['superadmin', 'admin', 'manager', 'executive']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: superadmin, admin, manager, executive' },
        { status: 400 }
      )
    }

    // Create user in auth.users first using service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
      },
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return NextResponse.json({ error: authError.message }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User not created in auth system' }, { status: 500 })
    }

    // Wait a bit for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 500))

    // Update the profile with all fields
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: name,
        internal_role: role,
        status,
        phone_number: phoneNumber || null,
        username: username || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id)
      .select()
      .single()

    if (error) {
      console.error('Error creating internal user:', error)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const user = {
      id: data.id,
      name: data.full_name || '',
      email: data.email,
      role: data.internal_role,
      status: data.status || 'active',
      phoneNumber: data.phone_number || null,
      username: data.username || null,
      avatarUrl: data.avatar_url || null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/internal-users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

