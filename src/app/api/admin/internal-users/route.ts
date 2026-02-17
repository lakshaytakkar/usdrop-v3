import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import crypto from 'crypto'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET() {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .not('internal_role', 'is', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching internal users:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json([])
    }

    const users = data.map((user: any) => ({
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

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const body = await request.json()
    const { name, email, password, role, status = 'active', phoneNumber, username, avatarUrl } = body

    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: 'Name, email, password, and role are required' },
        { status: 400 }
      )
    }

    const validRoles = ['superadmin', 'admin', 'manager', 'executive']
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: superadmin, admin, manager, executive' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    const { data: result, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email,
        full_name: name,
        password_hash: passwordHash,
        internal_role: role,
        status,
        phone_number: phoneNumber || null,
        username: username || null,
        avatar_url: avatarUrl || null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single()

    if (error || !result) {
      console.error('Error creating internal user:', error)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
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

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/admin/internal-users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
