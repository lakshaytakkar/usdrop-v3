import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ChapterCompletion } from '@/types/courses'

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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; chapterId: string }> }
) {
  try {
    const user = await getAuthenticatedUser(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: courseId, chapterId } = await params
    const body = await request.json().catch(() => ({}))
    const { time_spent_minutes } = body

    const supabaseAdmin = (await import('@/lib/supabase/server')).supabaseAdmin

    // Get enrollment
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

    // Verify chapter belongs to course
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

    // Verify module belongs to course
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

    // Check if already completed
    const { data: existing } = await supabaseAdmin
      .from('chapter_completions')
      .select('id')
      .eq('enrollment_id', enrollment.id)
      .eq('chapter_id', chapterId)
      .single()

    if (existing) {
      // Update existing completion
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

    // Create new completion
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

