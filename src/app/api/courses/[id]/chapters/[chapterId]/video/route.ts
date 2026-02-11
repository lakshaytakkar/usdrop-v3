import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getVideoSignedUrl } from '@/lib/storage/course-storage'
import { getCurrentUser } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const { id: courseId, chapterId } = await params
    
    const currentUser = await getCurrentUser()
    const userId = currentUser?.id || null

    const { data: chapter, error: chapterError } = await supabaseAdmin
      .from('course_chapters')
      .select(`
        id,
        module_id,
        content,
        course_modules!inner(
          id,
          course_id,
          courses!inner(
            id,
            instructor_id,
            published
          )
        )
      `)
      .eq('id', chapterId)
      .single()

    if (chapterError || !chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    const course = (chapter.course_modules as any).courses
    const module = chapter.course_modules as any

    if (course.id !== courseId) {
      return NextResponse.json(
        { error: 'Course ID mismatch' },
        { status: 400 }
      )
    }

    let hasAccess = false

    if (userId) {
      const { data: enrollment } = await supabaseAdmin
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', userId)
        .single()

      if (enrollment) {
        hasAccess = true
      }

      if (course.instructor_id === userId) {
        hasAccess = true
      }

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('internal_role')
        .eq('id', userId)
        .single()

      if (profile?.internal_role === 'superadmin' || profile?.internal_role === 'admin') {
        hasAccess = true
      }
    }

    const { data: chapterData } = await supabaseAdmin
      .from('course_chapters')
      .select('is_preview')
      .eq('id', chapterId)
      .single()

    if (chapterData?.is_preview && course.published) {
      hasAccess = true
    }

    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied. Please enroll in the course to view this video.' },
        { status: 403 }
      )
    }

    const content = chapter.content as any
    const videoStoragePath = content?.video_storage_path || content?.video_url

    if (!videoStoragePath) {
      return NextResponse.json(
        { error: 'Video not found for this chapter' },
        { status: 404 }
      )
    }

    let storagePath = videoStoragePath
    if (videoStoragePath.startsWith('http')) {
      const urlParts = new URL(videoStoragePath)
      storagePath = urlParts.pathname.replace('/storage/v1/object/public/course-videos/', '')
    }

    const expiresIn = 3600
    const signedUrl = await getVideoSignedUrl(storagePath, expiresIn)

    return NextResponse.json({
      url: signedUrl,
      expiresIn,
      expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
    })
  } catch (error) {
    console.error('Error getting video URL:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get video URL' },
      { status: 500 }
    )
  }
}
