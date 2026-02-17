import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getTaskStats } from '@/lib/dev-tasks/queries'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
