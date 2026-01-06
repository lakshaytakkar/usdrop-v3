import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTasks } from '@/lib/dev-tasks/queries'
import { createTask } from '@/lib/dev-tasks/mutations'
import type { TaskFilters, DevTaskFormData } from '@/types/dev-tasks'

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

    // Parse query params for filters
    const searchParams = request.nextUrl.searchParams
    const filters: TaskFilters = {}

    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')?.split(',') as any
    }
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority')?.split(',') as any
    }
    if (searchParams.get('assigned_to')) {
      filters.assigned_to = searchParams.get('assigned_to')?.split(',')
    }
    if (searchParams.get('created_by')) {
      filters.created_by = searchParams.get('created_by')?.split(',')
    }
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search') || undefined
    }
    if (searchParams.get('parent_task_id')) {
      const parentId = searchParams.get('parent_task_id')
      filters.parent_task_id = parentId === 'null' ? null : parentId || undefined
    }
    if (searchParams.get('project_id')) {
      filters.project_id = searchParams.get('project_id') || undefined
    }

    const tasks = await getTasks(filters)

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json() as DevTaskFormData
    const task = await createTask(body, user.id)

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}


