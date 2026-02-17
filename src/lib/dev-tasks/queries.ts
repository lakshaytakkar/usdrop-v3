import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import type { DevTask, DevTaskComment, DevTaskAttachment, DevTaskHistory, TaskFilters, TaskStats } from '@/types/dev-tasks'

export async function getTasks(filters?: TaskFilters): Promise<DevTask[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('dev_tasks')
    .select('*')

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

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) {
    console.error('Error fetching tasks:', error)
    throw error
  }

  const tasks = (data || []) as DevTask[]
  
  if (tasks.length > 0) {
    const assignedToIds = [...new Set(tasks.map(t => t.assigned_to).filter(Boolean))]
    const createdByIds = [...new Set(tasks.map(t => t.created_by).filter(Boolean))]
    const allUserIds = [...new Set([...assignedToIds, ...createdByIds])]
    
    if (allUserIds.length > 0) {
      const { data: users } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, email, avatar_url, username')
        .in('id', allUserIds as string[])

      const userMap = new Map((users || []).map((u: Record<string, unknown>) => [u.id, u]))
      
      tasks.forEach((task: DevTask) => {
        if (task.assigned_to && userMap.has(task.assigned_to)) {
          (task as unknown as Record<string, unknown>).assigned_user = userMap.get(task.assigned_to)
        }
        if (task.created_by && userMap.has(task.created_by)) {
          (task as unknown as Record<string, unknown>).created_user = userMap.get(task.created_by)
        }
      })
    }
  }
  
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

  return parentTasks.map(task => ({
    ...task,
    subtasks: subtasksMap.get(task.id) || []
  }))
}

export async function getTaskById(id: string): Promise<DevTask | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('dev_tasks')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching task:', error)
    throw error
  }

  const task = data as DevTask
  
  if (task.assigned_to || task.created_by) {
    const userIds = [task.assigned_to, task.created_by].filter(Boolean) as string[]
    const { data: users } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, email, avatar_url, username')
      .in('id', userIds)

    const userMap = new Map((users || []).map((u: Record<string, unknown>) => [u.id, u]))
    
    if (task.assigned_to) (task as unknown as Record<string, unknown>).assigned_user = userMap.get(task.assigned_to)
    if (task.created_by) (task as unknown as Record<string, unknown>).created_user = userMap.get(task.created_by)
  }

  return task
}

export async function getTaskComments(taskId: string): Promise<DevTaskComment[]> {
  const { data, error } = await supabaseAdmin
    .from('dev_task_comments')
    .select('*, profiles!dev_task_comments_user_id_fkey(id, full_name, email, avatar_url, username)')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching comments:', error)
    throw error
  }

  return (data || []).map((c: any) => ({
    ...c,
    user: c.profiles || null,
    profiles: undefined,
  })) as unknown as DevTaskComment[]
}

export async function getTaskAttachments(taskId: string): Promise<DevTaskAttachment[]> {
  const { data, error } = await supabaseAdmin
    .from('dev_task_attachments')
    .select('*, profiles!dev_task_attachments_uploaded_by_fkey(id, full_name, email, avatar_url, username)')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching attachments:', error)
    throw error
  }

  return (data || []).map((a: any) => ({
    ...a,
    uploader: a.profiles || null,
    profiles: undefined,
  })) as unknown as DevTaskAttachment[]
}

export async function getTaskHistory(taskId: string): Promise<DevTaskHistory[]> {
  const { data, error } = await supabaseAdmin
    .from('dev_task_history')
    .select('*, profiles!dev_task_history_changed_by_fkey(id, full_name, email, avatar_url, username)')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching history:', error)
    throw error
  }

  return (data || []).map((h: any) => ({
    ...h,
    changed_user: h.profiles || null,
    profiles: undefined,
  })) as unknown as DevTaskHistory[]
}

export async function getTaskStats(): Promise<TaskStats> {
  const supabase = await createClient()
  
  const { data: tasks, error } = await supabase
    .from('dev_tasks')
    .select('status, priority')
    .is('parent_task_id', null)

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

  tasks?.forEach((task: { status: string; priority: string }) => {
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

    if (task.priority in stats.byPriority) {
      stats.byPriority[task.priority as keyof typeof stats.byPriority]++
    }
  })

  return stats
}

export async function getTasksAssignedToUser(userId: string): Promise<DevTask[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('dev_tasks')
    .select('*')
    .eq('assigned_to', userId)
    .is('parent_task_id', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching assigned tasks:', error)
    throw error
  }

  return (data || []) as DevTask[]
}

export async function getRecentTasks(limit = 10): Promise<DevTask[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('dev_tasks')
    .select('*')
    .is('parent_task_id', null)
    .order('updated_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent tasks:', error)
    throw error
  }

  return (data || []) as DevTask[]
}
