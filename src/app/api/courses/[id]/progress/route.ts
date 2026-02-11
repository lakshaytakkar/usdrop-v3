import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { EnrollmentProgressResponse } from '@/types/courses'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: courseId } = await params

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

    const { data: completions } = await supabaseAdmin
      .from('chapter_completions')
      .select('chapter_id')
      .eq('enrollment_id', enrollment.id)

    const completed_chapters = completions?.map((c: { chapter_id: string }) => c.chapter_id) || []

    const { data: modules } = await supabaseAdmin
      .from('course_modules')
      .select('id')
      .eq('course_id', courseId)

    const moduleIds = modules?.map((m: { id: string }) => m.id) || []
    
    const { count: totalChapters } = await supabaseAdmin
      .from('course_chapters')
      .select('*', { count: 'exact', head: true })
      .in('module_id', moduleIds)

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
