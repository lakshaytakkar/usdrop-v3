import { NextRequest, NextResponse } from 'next/server'
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

    const { data: courseResult, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .single()

    if (courseError || !courseResult) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const { data: moduleResult, error: moduleError } = await supabaseAdmin
      .from('course_modules')
      .select('id, course_id')
      .eq('id', moduleId)
      .eq('course_id', courseId)
      .single()

    if (moduleError || !moduleResult) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    const isTempUpload = chapterId === 'new' || chapterId.startsWith('temp-')
    let chapterExists = false

    if (!isTempUpload) {
      const { data: chapterResult, error: chapterError } = await supabaseAdmin
        .from('course_chapters')
        .select('id, module_id')
        .eq('id', chapterId)
        .eq('module_id', moduleId)
        .single()

      if (chapterError || !chapterResult) {
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
      const { data: currentChapter } = await supabaseAdmin
        .from('course_chapters')
        .select('content')
        .eq('id', chapterId)
        .single()

      const content = currentChapter?.content || {}
      const updatedContent = {
        ...content,
        video_url: uploadResult.url,
        video_storage_path: uploadResult.path,
        video_duration: null,
      }

      const { error: updateError } = await supabaseAdmin
        .from('course_chapters')
        .update({ content: updatedContent, updated_at: new Date().toISOString() })
        .eq('id', chapterId)

      if (updateError) {
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
