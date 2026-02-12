import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const body = await request.json()
    const { published } = body

    if (typeof published !== 'boolean') {
      return NextResponse.json(
        { error: 'published field is required and must be a boolean' },
        { status: 400 }
      )
    }

    let publishedAt = undefined

    if (published) {
      const existing = await sql`SELECT published_at FROM courses WHERE id = ${id} LIMIT 1`

      if (existing.length > 0 && !existing[0].published_at) {
        publishedAt = new Date().toISOString()
      }
    }

    let result
    if (publishedAt !== undefined) {
      result = await sql`
        UPDATE courses SET published = ${published}, published_at = ${publishedAt}, updated_at = now()
        WHERE id = ${id} RETURNING *
      `
    } else {
      result = await sql`
        UPDATE courses SET published = ${published}, updated_at = now()
        WHERE id = ${id} RETURNING *
      `
    }

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update course publish status' },
        { status: 500 }
      )
    }

    return NextResponse.json({ course: result[0] })
  } catch (error) {
    console.error('Unexpected error updating course publish status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
