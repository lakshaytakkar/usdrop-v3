import { NextRequest, NextResponse } from 'next/server'
import { hashPassword } from '@/lib/auth'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    const data = await sql`
      SELECT * FROM profiles WHERE id = ${id} LIMIT 1
    `

    if (!data || data.length === 0 || data[0].internal_role === null) {
      return NextResponse.json({ error: 'User not found or not an internal user' }, { status: 404 })
    }

    const row = data[0]
    const user = {
      id: row.id,
      name: row.full_name || '',
      email: row.email,
      role: row.internal_role,
      status: row.status || 'active',
      phoneNumber: row.phone_number || null,
      username: row.username || null,
      avatarUrl: row.avatar_url || null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
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

    const existing = await sql`
      SELECT internal_role FROM profiles WHERE id = ${id} LIMIT 1
    `

    if (!existing || existing.length === 0 || existing[0].internal_role === null) {
      return NextResponse.json({ error: 'User not found or not an internal user' }, { status: 404 })
    }

    if (password !== undefined && password.trim() !== '') {
      const passwordHash = await hashPassword(password)
      await sql`UPDATE profiles SET password_hash = ${passwordHash} WHERE id = ${id}`
    }

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

    const setClauses: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    for (const [key, value] of Object.entries(updates)) {
      setClauses.push(`${key} = $${paramIndex++}`)
      values.push(value)
    }

    values.push(id)

    try {
      const result = await sql.unsafe(
        `UPDATE profiles SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        values
      )

      if (!result || result.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
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

      return NextResponse.json(user)
    } catch (err: any) {
      if (err?.code === '23505') {
        return NextResponse.json(
          { error: 'A user with this email already exists' },
          { status: 409 }
        )
      }
      throw err
    }
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

    const existing = await sql`
      SELECT internal_role FROM profiles WHERE id = ${id} LIMIT 1
    `

    if (!existing || existing.length === 0 || existing[0].internal_role === null) {
      return NextResponse.json({ error: 'User not found or not an internal user' }, { status: 404 })
    }

    await sql`DELETE FROM profiles WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/admin/internal-users/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
