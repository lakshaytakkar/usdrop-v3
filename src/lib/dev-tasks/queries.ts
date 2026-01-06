import { createClient } from '@/lib/supabase/server'
import type { DevTask, DevTaskComment, DevTaskAttachment, DevTaskHistory, TaskFilters, TaskStats } from '@/types/dev-tasks'
import type { SupabaseClient } from '@supabase/supabase-js'

// Helper function to build task query with relations
function buildTaskQuery(supabase: SupabaseClient, includeSubtasks = false) {
  const baseSelect = `
    *,
    assigned_user:profiles!dev_tasks_assigned_to_fkey(
      id,
      full_name,
      email,
      avatar_url,
      username
    ),
    created_user:profiles!dev_tasks_created_by_fkey(
      id,
      full_name,
      email,
      avatar_url,
      username
    )
  `

  if (includeSubtasks) {
    return supabase
      .from('dev_tasks')
      .select(`
        ${baseSelect},
        subtasks:dev_tasks!dev_tasks_parent_task_id_fkey(
          *,
          assigned_user:profiles!dev_tasks_assigned_to_fkey(
            id,
            full_name,
            email,
            avatar_url,
            username
          ),
          created_user:profiles!dev_tasks_created_by_fkey(
            id,
            full_name,
            email,
            avatar_url,
            username
          )
        )
      `)
  }

  return supabase
    .from('dev_tasks')
    .select(baseSelect)
}

// Get all tasks with optional filters
export async function getTasks(filters?: TaskFilters): Promise<DevTask[]> {
  const supabase = await createClient()
  
  let query = buildTaskQuery(supabase, true)

  // Apply filters
  if (filters?.status && filters.status.length > 0) {
    query = query.in('status', filters.status)
  }

  if (filters?.priority && filters.priority.length > 0) {
    query = query.in('priority', filters.priority)
  }

  if (filters?.assigned_to && filters.assigned_to.length > 0) {
    query = query.in('assigned_to', filters.assigned_to)
  }

  if (filters?.created_by && filters.created_by.length > 0) {
    query = query.in('created_by', filters.created_by)
  }

  if (filters?.parent_task_id !== undefined) {
    if (filters.parent_task_id === null) {
      query = query.is('parent_task_id', null)
    } else {
      query = query.eq('parent_task_id', filters.parent_task_id)
    }
  }

  if (filters?.project_id) {
    query = query.eq('project_id', filters.project_id)
  }

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  // Order by created_at desc by default
  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }

  // Transform and organize hierarchical structure
  const tasks = (data || []) as DevTask[]
  
  // Separate parent tasks (no parent_task_id) and subtasks
  const parentTasks = tasks.filter(task => !task.parent_task_id)
  const subtasksMap = new Map<string, DevTask[]>()
  
  tasks.forEach(task => {
    if (task.parent_task_id) {
      if (!subtasksMap.has(task.parent_task_id)) {
        subtasksMap.set(task.parent_task_id, [])
      }
      subtasksMap.get(task.parent_task_id)!.push(task)
    }
  })

  // Attach subtasks to parent tasks
  return parentTasks.map(task => ({
    ...task,
    subtasks: subtasksMap.get(task.id) || []
  }))
}

// Get a single task by ID
export async function getTaskById(id: string): Promise<DevTask | null> {
  const supabase = await createClient()
  
  const { data, error } = await buildTaskQuery(supabase, true)
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      // Not found
      return null
    }
    console.error('Error fetching task:', error)
    throw error
  }

  return data as DevTask
}

// Get comments for a task
export async function getTaskComments(taskId: string): Promise<DevTaskComment[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('dev_task_comments')
    .select(`
      *,
      user:profiles!dev_task_comments_user_id_fkey(
        id,
        full_name,
        email,
        avatar_url,
        username
      )
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    throw error
  }

  return (data || []) as DevTaskComment[]
}

// Get attachments for a task
export async function getTaskAttachments(taskId: string): Promise<DevTaskAttachment[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('dev_task_attachments')
    .select(`
      *,
      uploader:profiles!dev_task_attachments_uploaded_by_fkey(
        id,
        full_name,
        email,
        avatar_url,
        username
      )
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching attachments:', error)
    throw error
  }

  // Generate signed URLs for attachments
  const attachments = (data || []) as DevTaskAttachment[]
  
  const attachmentsWithUrls = await Promise.all(
    attachments.map(async (attachment) => {
      const { data: urlData } = await supabase.storage
        .from('dev-task-attachments')
        .createSignedUrl(attachment.file_path, 3600) // 1 hour expiry

      return {
        ...attachment,
        signed_url: urlData?.signedUrl || null
      }
    })
  )

  return attachmentsWithUrls
}

// Get history for a task
export async function getTaskHistory(taskId: string): Promise<DevTaskHistory[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('dev_task_history')
    .select(`
      *,
      changed_user:profiles!dev_task_history_changed_by_fkey(
        id,
        full_name,
        email,
        avatar_url,
        username
      )
    `)
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching history:', error)
    throw error
  }

  return (data || []) as DevTaskHistory[]
}

// Get task statistics
export async function getTaskStats(): Promise<TaskStats> {
  const supabase = await createClient()
  
  // Get all tasks
  const { data: tasks, error } = await supabase
    .from('dev_tasks')
    .select('status, priority')
    .is('parent_task_id', null) // Only count parent tasks

  if (error) {
    console.error('Error fetching task stats:', error)
    throw error
  }

  const stats: TaskStats = {
    total: tasks?.length || 0,
    notStarted: 0,
    inProgress: 0,
    inReview: 0,
    completed: 0,
    blocked: 0,
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0
    }
  }

  tasks?.forEach(task => {
    // Count by status
    switch (task.status) {
      case 'not-started':
        stats.notStarted++
        break
      case 'in-progress':
        stats.inProgress++
        break
      case 'in-review':
        stats.inReview++
        break
      case 'completed':
        stats.completed++
        break
      case 'blocked':
        stats.blocked++
        break
    }

    // Count by priority
    if (task.priority in stats.byPriority) {
      stats.byPriority[task.priority as keyof typeof stats.byPriority]++
    }
  })

  return stats
}

// Get tasks assigned to a user
export async function getTasksAssignedToUser(userId: string): Promise<DevTask[]> {
  const supabase = await createClient()
  
  const { data, error } = await buildTaskQuery(supabase)
    .eq('assigned_to', userId)
    .is('parent_task_id', null) // Only parent tasks
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching assigned tasks:', error)
    throw error
  }

  return (data || []) as DevTask[]
}

// Get recent tasks
export async function getRecentTasks(limit = 10): Promise<DevTask[]> {
  const supabase = await createClient()
  
  const { data, error } = await buildTaskQuery(supabase)
    .is('parent_task_id', null)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent tasks:', error)
    throw error
  }

  return (data || []) as DevTask[]
}

