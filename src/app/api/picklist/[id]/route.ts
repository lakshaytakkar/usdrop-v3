import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// DELETE /api/picklist/[id] - Remove product from user's picklist
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Delete the picklist item (RLS ensures user can only delete their own items)
    const { error: deleteError } = await supabase
      .from('user_picklist')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (deleteError) {
      console.error('Error removing from picklist:', deleteError)
      return NextResponse.json(
        { error: 'Failed to remove product from picklist' },
        { status: 500 }
      )
    }

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

