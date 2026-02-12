import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import sql from '@/lib/db'
import crypto from 'crypto'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET() {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult

    const data = await sql`
      SELECT * FROM profiles
      WHERE internal_role IS NOT NULL
      ORDER BY created_at DESC
    `

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

    const existing = await sql`SELECT id FROM profiles WHERE email = ${email} LIMIT 1`
    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)
    const userId = crypto.randomUUID()
    const now = new Date().toISOString()

    const result = await sql`
      INSERT INTO profiles (
        id, email, full_name, password_hash, internal_role,
        status, phone_number, username, avatar_url,
        created_at, updated_at
      ) VALUES (
        ${userId}, ${email}, ${name}, ${passwordHash}, ${role},
        ${status}, ${phoneNumber || null}, ${username || null}, ${avatarUrl || null},
        ${now}, ${now}
      )
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    const data = result[0]
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
