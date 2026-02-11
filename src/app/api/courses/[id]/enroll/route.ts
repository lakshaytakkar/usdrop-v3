import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CourseEnrollment } from '@/types/courses'

export async function POST(
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

    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, published')
      .eq('id', courseId)
      .single()

    if (courseError || !course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    if (!course.published) {
      return NextResponse.json(
        { error: 'Course is not published' },
        { status: 403 }
      )
    }

    const { data: existingEnrollment } = await supabaseAdmin
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', user.id)
      .single()

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this course' },
        { status: 400 }
      )
    }

    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('course_enrollments')
      .insert({
        course_id: courseId,
        user_id: user.id,
        enrolled_at: new Date().toISOString(),
        progress_percentage: 0,
      })
      .select()
      .single()

    if (enrollmentError) {
      console.error('Error creating enrollment:', enrollmentError)
      return NextResponse.json(
        { error: 'Failed to enroll in course', details: enrollmentError.message },
        { status: 500 }
      )
    }

    const response: { enrollment: CourseEnrollment } = {
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
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Unexpected error enrolling in course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
