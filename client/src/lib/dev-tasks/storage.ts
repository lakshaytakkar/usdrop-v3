import { apiFetch } from '@/lib/supabase'
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from './storage-utils'

export { formatFileSize, validateFile } from './storage-utils'

export async function uploadTaskAttachment(
  file: File,
  taskId: string,
  _userId: string
): Promise<{ path: string; url: string }> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed`)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('taskId', taskId)

  const res = await apiFetch(`/api/dev-tasks/${taskId}/attachments/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }))
    throw new Error(err.error || 'Upload failed')
  }

  const data = await res.json()
  return { path: data.path, url: data.url }
}

export async function getAttachmentSignedUrl(
  filePath: string,
  expiresIn = 3600
): Promise<string> {
  const res = await apiFetch(`/api/dev-tasks/attachments/signed-url`, {
    method: 'POST',
    body: JSON.stringify({ filePath, expiresIn }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to get URL' }))
    throw new Error(err.error || 'Failed to get signed URL')
  }

  const data = await res.json()
  return data.signedUrl
}

export async function deleteAttachmentFile(filePath: string): Promise<void> {
  const res = await apiFetch(`/api/dev-tasks/attachments/delete`, {
    method: 'POST',
    body: JSON.stringify({ filePath }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Delete failed' }))
    throw new Error(err.error || 'Delete failed')
  }
}
