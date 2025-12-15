import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'

// GET /api/admin/internal-users/[id] - Get a single internal user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      console.error('Error fetching internal user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Check if user is an internal user
    if (!data || data.internal_role === null) {
      return NextResponse.json({ error: 'User not found or not an internal user' }, { status: 404 })
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

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in GET /api/admin/internal-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/admin/internal-users/[id] - Update an internal user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, email, role, status, phoneNumber, username, avatarUrl, password } = body

    // Build update object with only provided fields
    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updates.full_name = name
    if (email !== undefined) updates.email = email
    if (role !== undefined) {
      const validRoles = ['superadmin', 'admin', 'manager', 'executive']
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role. Must be one of: superadmin, admin, manager, executive' },
          { status: 400 }
        )
      }
      updates.internal_role = role
    }
    if (status !== undefined) {
      const validStatuses = ['active', 'inactive', 'suspended']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: active, inactive, suspended' },
          { status: 400 }
        )
      }
      updates.status = status
    }
    if (phoneNumber !== undefined) updates.phone_number = phoneNumber || null
    if (username !== undefined) updates.username = username || null
    if (avatarUrl !== undefined) updates.avatar_url = avatarUrl || null

    // Handle password update separately if provided
    if (password !== undefined && password.trim() !== '') {
      // Update password in auth.users using admin API
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
      
      const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(id, {
        password: password
      })

      if (passwordError) {
        console.error('Error updating password:', passwordError)
        return NextResponse.json(
          { error: 'Failed to update password: ' + passwordError.message },
          { status: 500 }
        )
      }
    }

    // First check if user exists and is internal
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('internal_role')
      .eq('id', id)
      .single()

    if (!existingUser || existingUser.internal_role === null) {
      return NextResponse.json({ error: 'User not found or not an internal user' }, { status: 404 })
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        )
      }
      console.error('Error updating internal user:', error)
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

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in PATCH /api/admin/internal-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/internal-users/[id] - Delete an internal user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // First check if user exists and is internal
    const { data: existingUser } = await supabaseAdmin
      .from('profiles')
      .select('internal_role')
      .eq('id', id)
      .single()

    if (!existingUser || existingUser.internal_role === null) {
      return NextResponse.json({ error: 'User not found or not an internal user' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting internal user:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/internal-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

