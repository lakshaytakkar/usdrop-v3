import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { EnrollmentProgressResponse } from '@/types/courses'

// Helper to get authenticated user
async function getAuthenticatedUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  return user
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: courseId } = await params

    const supabaseAdmin = (await import('@/lib/supabase/server')).supabaseAdmin

    // Get enrollment
    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('course_enrollments')
      .select('*')
      .eq('course_id', courseId)
      .eq('user_id', user.id)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 404 }
      )
    }

    // Get completed chapters
    const { data: completions } = await supabaseAdmin
      .from('chapter_completions')
      .select('chapter_id')
      .eq('enrollment_id', enrollment.id)

    const completed_chapters = completions?.map(c => c.chapter_id) || []

    // Get total chapters count
    // First, get module IDs for this course
    const { data: modules } = await supabaseAdmin
      .from('course_modules')
      .select('id')
      .eq('course_id', courseId)

    const moduleIds = modules?.map(m => m.id) || []
    
    const { count: totalChapters } = await supabaseAdmin
      .from('course_chapters')
      .select('*', { count: 'exact', head: true })
      .in('module_id', moduleIds)

    // Get last accessed chapter if exists
    let lastAccessedChapter = null
    if (enrollment.last_accessed_chapter_id) {
      const { data: chapter } = await supabaseAdmin
        .from('course_chapters')
        .select('*')
        .eq('id', enrollment.last_accessed_chapter_id)
        .single()

      if (chapter) {
        lastAccessedChapter = {
          id: chapter.id,
          module_id: chapter.module_id,
          title: chapter.title,
          description: chapter.description,
          content_type: chapter.content_type,
          content: chapter.content,
          order_index: chapter.order_index,
          duration_minutes: chapter.duration_minutes,
          is_preview: chapter.is_preview || false,
          created_at: chapter.created_at,
          updated_at: chapter.updated_at,
        }
      }
    }

    const response: EnrollmentProgressResponse = {
      enrollment: {
        id: enrollment.id,
        course_id: enrollment.course_id,
        user_id: enrollment.user_id,
        enrolled_at: enrollment.enrolled_at,
        completed_at: enrollment.completed_at,
        progress_percentage: parseFloat(enrollment.progress_percentage || '0'),
        last_accessed_at: enrollment.last_accessed_at,
        last_accessed_chapter_id: enrollment.last_accessed_chapter_id,
      },
      completed_chapters,
      total_chapters: totalChapters || 0,
      progress_percentage: parseFloat(enrollment.progress_percentage || '0'),
      last_accessed_chapter: lastAccessedChapter || undefined,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error fetching progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

