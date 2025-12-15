import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getVideoSignedUrl } from '@/lib/storage/course-storage'
import { createClient } from '@supabase/supabase-js'

// Public client for checking auth
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * GET /api/courses/[id]/chapters/[chapterId]/video
 * Get signed URL for a course video (requires enrollment or admin access)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const { id: courseId, chapterId } = await params
    
    // Get auth header
    const authHeader = request.headers.get('authorization')
    let userId: string | null = null

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      })

      const { data: { user } } = await supabase.auth.getUser()
      userId = user?.id || null
    }

    // Verify chapter exists and get course info
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

    // Verify course ID matches
    if (course.id !== courseId) {
      return NextResponse.json(
        { error: 'Course ID mismatch' },
        { status: 400 }
      )
    }

    // Check access permissions
    let hasAccess = false

    if (userId) {
      // Check if user is enrolled
      const { data: enrollment } = await supabaseAdmin
        .from('course_enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('user_id', userId)
        .single()

      if (enrollment) {
        hasAccess = true
      }

      // Check if user is instructor
      if (course.instructor_id === userId) {
        hasAccess = true
      }

      // Check if user is admin
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('internal_role')
        .eq('id', userId)
        .single()

      if (profile?.internal_role === 'superadmin' || profile?.internal_role === 'admin') {
        hasAccess = true
      }
    }

    // Check if chapter is preview (public access)
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

    // Get video storage path from chapter content
    const content = chapter.content as any
    const videoStoragePath = content?.video_storage_path || content?.video_url

    if (!videoStoragePath) {
      return NextResponse.json(
        { error: 'Video not found for this chapter' },
        { status: 404 }
      )
    }

    // Extract path if it's a full URL
    let storagePath = videoStoragePath
    if (videoStoragePath.startsWith('http')) {
      // Extract path from URL
      const urlParts = new URL(videoStoragePath)
      storagePath = urlParts.pathname.replace('/storage/v1/object/public/course-videos/', '')
    }

    // Generate signed URL (valid for 1 hour)
    const expiresIn = 3600 // 1 hour
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

