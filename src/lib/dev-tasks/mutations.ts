import { createClient } from '@/lib/supabase/server'
import type { DevTask, DevTaskComment, DevTaskFormData, DevTaskAttachment } from '@/types/dev-tasks'

// Create a new task
export async function createTask(taskData: DevTaskFormData, createdBy: string): Promise<DevTask> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('dev_tasks')
    .insert({
      ...taskData,
      created_by: createdBy,
      doc_links: taskData.doc_links || [],
      related_files: taskData.related_files || [],
      metadata: taskData.metadata || {}
    })
    .select(`
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
    `)
    .single()

  if (error) {
    console.error('Error creating task:', error)
    throw error
  }

  return data as DevTask
}

// Update an existing task
export async function updateTask(
  id: string,
  taskData: Partial<DevTaskFormData>,
  updatedBy: string
): Promise<DevTask> {
  const supabase = await createClient()

  // Prepare update data, ensuring JSONB fields are properly formatted
  const updateData: Record<string, any> = { ...taskData }
  
  if (taskData.doc_links !== undefined) {
    updateData.doc_links = taskData.doc_links
  }
  if (taskData.related_files !== undefined) {
    updateData.related_files = taskData.related_files
  }
  if (taskData.metadata !== undefined) {
    updateData.metadata = taskData.metadata
  }

  const { data, error } = await supabase
    .from('dev_tasks')
    .update(updateData)
    .eq('id', id)
    .select(`
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
    `)
    .single()

  if (error) {
    console.error('Error updating task:', error)
    throw error
  }

  return data as DevTask
}

// Delete a task
export async function deleteTask(id: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('dev_tasks')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

// Add a comment to a task
export async function addComment(
  taskId: string,
  commentText: string,
  userId: string,
  isSystemLog = false
): Promise<DevTaskComment> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('dev_task_comments')
    .insert({
      task_id: taskId,
      user_id: userId,
      comment_text: commentText,
      is_system_log: isSystemLog
    })
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
    .single()

  if (error) {
    console.error('Error adding comment:', error)
    throw error
  }

  return data as DevTaskComment
}

// Update a comment
export async function updateComment(
  commentId: string,
  commentText: string
): Promise<DevTaskComment> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('dev_task_comments')
    .update({ comment_text: commentText })
    .eq('id', commentId)
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
    .single()

  if (error) {
    console.error('Error updating comment:', error)
    throw error
  }

  return data as DevTaskComment
}

// Delete a comment
export async function deleteComment(commentId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('dev_task_comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    console.error('Error deleting comment:', error)
    throw error
  }
}

// Record attachment in database after file upload
export async function createAttachmentRecord(
  taskId: string,
  fileName: string,
  filePath: string,
  fileSize: number,
  fileType: string,
  uploadedBy: string
): Promise<DevTaskAttachment> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('dev_task_attachments')
    .insert({
      task_id: taskId,
      file_name: fileName,
      file_path: filePath,
      file_size: fileSize,
      file_type: fileType,
      uploaded_by: uploadedBy
    })
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
    .single()

  if (error) {
    console.error('Error creating attachment record:', error)
    throw error
  }

  return data as DevTaskAttachment
}

// Delete an attachment
export async function deleteAttachment(attachmentId: string): Promise<void> {
  const supabase = await createClient()

  // First get the file path to delete from storage
  const { data: attachment } = await supabase
    .from('dev_task_attachments')
    .select('file_path')
    .eq('id', attachmentId)
    .single()

  if (attachment) {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('dev-task-attachments')
      .remove([attachment.file_path])

    if (storageError) {
      console.error('Error deleting file from storage:', storageError)
      // Continue to delete record even if storage delete fails
    }
  }

  // Delete the record
  const { error } = await supabase
    .from('dev_task_attachments')
    .delete()
    .eq('id', attachmentId)

  if (error) {
    console.error('Error deleting attachment record:', error)
    throw error
  }
}

// Update task status (with automatic history tracking)
export async function updateTaskStatus(
  taskId: string,
  newStatus: DevTask['status'],
  userId: string
): Promise<DevTask> {
  const supabase = await createClient()

  // Get current status for history
  const { data: currentTask } = await supabase
    .from('dev_tasks')
    .select('status')
    .eq('id', taskId)
    .single()

  // Update the task
  const task = await updateTask(taskId, { status: newStatus }, userId)

  // Add a system log comment about the status change
  if (currentTask && currentTask.status !== newStatus) {
    try {
      await addComment(
        taskId,
        `Status changed from ${currentTask.status} to ${newStatus}`,
        userId,
        true
      )
    } catch (error) {
      // Non-critical error, don't fail the update
      console.warn('Failed to add status change comment:', error)
    }
  }

  return task
}

// Update task priority (with automatic history tracking)
export async function updateTaskPriority(
  taskId: string,
  newPriority: DevTask['priority'],
  userId: string
): Promise<DevTask> {
  return updateTask(taskId, { priority: newPriority }, userId)
}

// Assign task to user
export async function assignTask(
  taskId: string,
  userId: string | null,
  assignedBy: string
): Promise<DevTask> {
  return updateTask(taskId, { assigned_to: userId }, assignedBy)
}

