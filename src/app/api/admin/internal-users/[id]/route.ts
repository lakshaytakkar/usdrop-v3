import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data || data.internal_role === null) {
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const body = await request.json()
    const { name, email, role, status, phoneNumber, username, avatarUrl, password } = body

    const { data: existing, error: existingError } = await supabaseAdmin
      .from('profiles')
      .select('internal_role')
      .eq('id', id)
      .single()

    if (existingError || !existing || existing.internal_role === null) {
      return NextResponse.json({ error: 'User not found or not an internal user' }, { status: 404 })
    }

    if (password !== undefined && password.trim() !== '') {
      const passwordHash = await hashPassword(password)
      await supabaseAdmin
        .from('profiles')
        .update({ password_hash: passwordHash })
        .eq('id', id)
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (name !== undefined) updateData.full_name = name
    if (email !== undefined) updateData.email = email
    if (role !== undefined) {
      const validRoles = ['superadmin', 'admin', 'manager', 'executive']
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: 'Invalid role. Must be one of: superadmin, admin, manager, executive' },
          { status: 400 }
        )
      }
      updateData.internal_role = role
    }
    if (status !== undefined) {
      const validStatuses = ['active', 'inactive', 'suspended']
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status. Must be one of: active, inactive, suspended' },
          { status: 400 }
        )
      }
      updateData.status = status
    }
    if (phoneNumber !== undefined) updateData.phone_number = phoneNumber || null
    if (username !== undefined) updateData.username = username || null
    if (avatarUrl !== undefined) updateData.avatar_url = avatarUrl || null

    const { data: result, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      if (updateError.code === '23505') {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!result) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = {
      id: result.id,
      name: result.full_name || '',
      email: result.email,
      role: result.internal_role,
      status: result.status || 'active',
      phoneNumber: result.phone_number || null,
      username: result.username || null,
      avatarUrl: result.avatar_url || null,
      createdAt: result.created_at,
      updatedAt: result.updated_at,
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in PATCH /api/admin/internal-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('internal_role')
      .eq('id', id)
      .single()

    if (!existing || existing.internal_role === null) {
      return NextResponse.json({ error: 'User not found or not an internal user' }, { status: 404 })
    }

    await supabaseAdmin.from('profiles').delete().eq('id', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/internal-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
