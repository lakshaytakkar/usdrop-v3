import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { supabaseAdmin } from '@/lib/supabase/server'
import { uploadCourseVideo, getVideoSignedUrl } from '@/lib/storage/course-storage'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; chapterId: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id: courseId, moduleId, chapterId } = await params

    const courseResult = await sql`SELECT id FROM courses WHERE id = ${courseId} LIMIT 1`

    if (courseResult.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const moduleResult = await sql`SELECT id, course_id FROM course_modules WHERE id = ${moduleId} AND course_id = ${courseId} LIMIT 1`

    if (moduleResult.length === 0) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    const isTempUpload = chapterId === 'new' || chapterId.startsWith('temp-')
    let chapterExists = false

    if (!isTempUpload) {
      const chapterResult = await sql`SELECT id, module_id FROM course_chapters WHERE id = ${chapterId} AND module_id = ${moduleId} LIMIT 1`

      if (chapterResult.length === 0) {
        return NextResponse.json(
          { error: 'Chapter not found' },
          { status: 404 }
        )
      }
      chapterExists = true
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, WebM, OGG, and QuickTime videos are allowed.' },
        { status: 400 }
      )
    }

    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed size of 500MB' },
        { status: 400 }
      )
    }

    const uploadResult = await uploadCourseVideo({
      file,
      courseId,
      moduleId,
      chapterId,
      filename: file.name,
    })

    const signedUrl = await getVideoSignedUrl(uploadResult.path, 3600)

    if (chapterExists) {
      const currentChapter = await sql`SELECT content FROM course_chapters WHERE id = ${chapterId} LIMIT 1`

      const content = currentChapter[0]?.content || {}
      const updatedContent = {
        ...content,
        video_url: uploadResult.url,
        video_storage_path: uploadResult.path,
        video_duration: null,
      }

      const updateResult = await sql`
        UPDATE course_chapters SET content = ${JSON.stringify(updatedContent)}, updated_at = now()
        WHERE id = ${chapterId}
      `

      if (updateResult.count === 0) {
        await supabaseAdmin.storage
          .from('course-videos')
          .remove([uploadResult.path])
          .catch(() => {})

        return NextResponse.json(
          { error: 'Failed to update chapter content' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      video: {
        url: uploadResult.url,
        signedUrl,
        path: uploadResult.path,
        size: uploadResult.size,
      },
    })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload video' },
      { status: 500 }
    )
  }
}
