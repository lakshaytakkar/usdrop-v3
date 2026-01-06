import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getRecentTasks } from '@/lib/dev-tasks/queries'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    const tasks = await getRecentTasks(limit)

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching recent tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent tasks' },
      { status: 500 }
    )
  }
}

