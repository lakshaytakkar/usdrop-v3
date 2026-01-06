import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTaskStats } from '@/lib/dev-tasks/queries'

export async function GET() {
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

    const stats = await getTaskStats()

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching task stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task stats' },
      { status: 500 }
    )
  }
}

