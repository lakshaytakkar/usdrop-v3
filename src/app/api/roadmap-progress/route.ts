import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin
      .from('roadmap_progress')
      .select('task_id, status')
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching roadmap progress:', error)
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    const statuses: Record<string, string> = {}
    for (const row of data || []) {
      statuses[row.task_id] = row.status
    }

    return NextResponse.json({ statuses })
  } catch (error) {
    console.error('Error in GET /api/roadmap-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { taskId, status } = body

    if (!taskId || !status) {
      return NextResponse.json({ error: 'taskId and status are required' }, { status: 400 })
    }

    if (!['not_started', 'in_progress', 'completed'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('roadmap_progress')
      .upsert(
        {
          user_id: user.id,
          task_id: taskId,
          status,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,task_id' }
      )

    if (error) {
      console.error('Error updating roadmap progress:', error)
      return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PUT /api/roadmap-progress:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
