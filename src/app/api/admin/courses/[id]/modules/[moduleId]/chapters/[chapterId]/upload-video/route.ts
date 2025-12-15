import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { uploadCourseVideo, getVideoSignedUrl } from '@/lib/storage/course-storage'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; chapterId: string }> }
) {
  try {
    const { id: courseId, moduleId, chapterId } = await params

    // Verify course, module, and chapter exist
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('id', courseId)
      .single()

    if (courseError) {
      console.error('Error fetching course for video upload:', courseError)
      if (courseError.code === 'PGRST116' || courseError.message?.includes('No rows')) {
        return NextResponse.json(
          { error: 'Course not found' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Failed to verify course', details: courseError.message },
        { status: 500 }
      )
    }

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const { data: module, error: moduleError } = await supabaseAdmin
      .from('course_modules')
      .select('id, course_id')
      .eq('id', moduleId)
      .eq('course_id', courseId)
      .single()

    if (moduleError || !module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Check if chapter exists or if this is a temporary upload (chapterId is "new" or a temp UUID)
    const isTempUpload = chapterId === 'new' || chapterId.startsWith('temp-')
    let chapterExists = false

    if (!isTempUpload) {
      const { data: chapter, error: chapterError } = await supabaseAdmin
        .from('course_chapters')
        .select('id, module_id')
        .eq('id', chapterId)
        .eq('module_id', moduleId)
        .single()

      if (chapterError || !chapter) {
        // If chapter doesn't exist and it's not a temp upload, return error
        return NextResponse.json(
          { error: 'Chapter not found' },
          { status: 404 }
        )
      }
      chapterExists = true
    }

    // Get uploaded file from FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, WebM, OGG, and QuickTime videos are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 500MB)
    const maxSize = 500 * 1024 * 1024 // 500MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed size of 500MB' },
        { status: 400 }
      )
    }

    // Upload video to Supabase Storage (handles temp uploads)
    const uploadResult = await uploadCourseVideo({
      file,
      courseId,
      moduleId,
      chapterId,
      filename: file.name,
    })

    // Generate signed URL for immediate access (valid for 1 hour)
    const signedUrl = await getVideoSignedUrl(uploadResult.path, 3600)

    // Only update chapter content if chapter exists (not a temp upload)
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
        .update({
          content: updatedContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', chapterId)

      if (updateError) {
        // If update fails, clean up uploaded file
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
        signedUrl, // Return signed URL for immediate use
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

