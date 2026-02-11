import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { ChapterCompletion } from '@/types/courses'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: courseId, chapterId } = await params
    const body = await request.json().catch(() => ({}))
    const { time_spent_minutes } = body

    const { data: enrollment, error: enrollmentError } = await supabaseAdmin
      .from('course_enrollments')
      .select('id')
      .eq('course_id', courseId)
      .eq('user_id', user.id)
      .single()

    if (enrollmentError || !enrollment) {
      return NextResponse.json(
        { error: 'Not enrolled in this course' },
        { status: 404 }
      )
    }

    const { data: chapter } = await supabaseAdmin
      .from('course_chapters')
      .select('id, module_id')
      .eq('id', chapterId)
      .single()

    if (!chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    const { data: module } = await supabaseAdmin
      .from('course_modules')
      .select('course_id')
      .eq('id', chapter.module_id)
      .single()

    if (!module || module.course_id !== courseId) {
      return NextResponse.json(
        { error: 'Chapter does not belong to this course' },
        { status: 400 }
      )
    }

    const { data: existing } = await supabaseAdmin
      .from('chapter_completions')
      .select('id')
      .eq('enrollment_id', enrollment.id)
      .eq('chapter_id', chapterId)
      .single()

    if (existing) {
      const { data: completion, error: updateError } = await supabaseAdmin
        .from('chapter_completions')
        .update({
          completed_at: new Date().toISOString(),
          time_spent_minutes: time_spent_minutes || null,
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to update completion', details: updateError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        completion: {
          id: completion.id,
          enrollment_id: completion.enrollment_id,
          chapter_id: completion.chapter_id,
          completed_at: completion.completed_at,
          time_spent_minutes: completion.time_spent_minutes,
        },
      })
    }

    const { data: completion, error: completionError } = await supabaseAdmin
      .from('chapter_completions')
      .insert({
        enrollment_id: enrollment.id,
        chapter_id: chapterId,
        completed_at: new Date().toISOString(),
        time_spent_minutes: time_spent_minutes || null,
      })
      .select()
      .single()

    if (completionError) {
      console.error('Error creating completion:', completionError)
      return NextResponse.json(
        { error: 'Failed to mark chapter complete', details: completionError.message },
        { status: 500 }
      )
    }

    const response: { completion: ChapterCompletion } = {
      completion: {
        id: completion.id,
        enrollment_id: completion.enrollment_id,
        chapter_id: completion.chapter_id,
        completed_at: completion.completed_at,
        time_spent_minutes: completion.time_spent_minutes,
      },
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Unexpected error completing chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
