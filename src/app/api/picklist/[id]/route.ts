import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

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

    await supabaseAdmin
      .from('user_picklist')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

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
