import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import sql from '@/lib/db'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    const result = await sql`
      DELETE FROM user_picklist
      WHERE id = ${id} AND user_id = ${user.id}
    `

    return NextResponse.json(
      { message: 'Product removed from picklist' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/picklist/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
