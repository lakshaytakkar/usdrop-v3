// Development Tasks Types

export type TaskStatus = 'not-started' | 'in-progress' | 'in-review' | 'completed' | 'blocked'
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

// Profile interface (minimal, for relations)
export interface Profile {
  id: string
  full_name: string | null
  email: string
  avatar_url: string | null
  username: string | null
}

export interface DevTask {
  id: string
  title: string
  description?: string | null
  status: TaskStatus
  priority: TaskPriority
  assigned_to?: string | null
  created_by: string
  parent_task_id?: string | null
  project_id?: string | null
  phase?: number | null
  estimated_hours?: number | null
  actual_hours?: number | null
  due_date?: string | null
  figma_link?: string | null
  doc_links?: string[] | null
  related_files?: string[] | null
  metadata?: Record<string, any> | null
  created_at: string
  updated_at: string
  // Relations
  assigned_user?: Profile | null
  created_user?: Profile | null
  subtasks?: DevTask[]
  comments?: DevTaskComment[]
  attachments?: DevTaskAttachment[]
  _count?: {
    subtasks?: number
    comments?: number
    attachments?: number
  }
}

export interface DevTaskComment {
  id: string
  task_id: string
  user_id: string
  comment_text: string
  is_system_log: boolean
  created_at: string
  user?: Profile | null
}

export interface DevTaskAttachment {
  id: string
  task_id: string
  file_name: string
  file_path: string
  file_size: number
  file_type: string
  uploaded_by: string
  created_at: string
  uploader?: Profile | null
  signed_url?: string | null // For temporary access URLs
}

export interface DevTaskHistory {
  id: string
  task_id: string
  field_name: string
  old_value?: string | null
  new_value?: string | null
  changed_by: string
  created_at: string
  changed_user?: Profile | null
}

// Form data types
export interface DevTaskFormData {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigned_to?: string | null
  parent_task_id?: string | null
  project_id?: string | null
  phase?: number | null
  estimated_hours?: number | null
  actual_hours?: number | null
  due_date?: string | null
  figma_link?: string | null
  doc_links?: string[]
  related_files?: string[]
  metadata?: Record<string, any>
}

// Filter types
export interface TaskFilters {
  status?: TaskStatus[]
  priority?: TaskPriority[]
  assigned_to?: string[]
  created_by?: string[]
  search?: string
  parent_task_id?: string | null
  project_id?: string | null
}

// Stats types
export interface TaskStats {
  total: number
  notStarted: number
  inProgress: number
  inReview: number
  completed: number
  blocked: number
  byPriority: {
    low: number
    medium: number
    high: number
    urgent: number
  }
}

