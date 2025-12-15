import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { QuizSubmissionRequest, QuizSubmissionResponse, QuizQuestion } from '@/types/courses'

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

// Helper to calculate quiz score
function calculateQuizScore(
  questions: QuizQuestion[],
  answers: Record<string, any>
): { score: number; passed: boolean; feedback: Record<string, { correct: boolean; explanation?: string }> } {
  let correctCount = 0
  const feedback: Record<string, { correct: boolean; explanation?: string }> = {}

  questions.forEach((question, index) => {
    const answerKey = question.id || `question_${index}`
    const userAnswer = answers[answerKey]
    let isCorrect = false

    if (question.type === 'multiple-choice') {
      isCorrect = userAnswer === question.correct_answer
    } else if (question.type === 'true-false') {
      isCorrect = String(userAnswer).toLowerCase() === String(question.correct_answer).toLowerCase()
    } else if (question.type === 'short-answer') {
      // Simple string comparison (could be enhanced with fuzzy matching)
      isCorrect = String(userAnswer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase()
    }

    if (isCorrect) {
      correctCount++
    }

    feedback[answerKey] = {
      correct: isCorrect,
      explanation: question.explanation,
    }
  })

  const totalQuestions = questions.length
  const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0
  const passed = score >= 70 // 70% passing threshold

  return { score, passed, feedback }
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
    const body: QuizSubmissionRequest = await request.json()

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

    // Get chapter with quiz questions
    const { data: chapter, error: chapterError } = await supabaseAdmin
      .from('course_chapters')
      .select('*')
      .eq('id', chapterId)
      .single()

    if (chapterError || !chapter) {
      return NextResponse.json(
        { error: 'Chapter not found' },
        { status: 404 }
      )
    }

    if (chapter.content_type !== 'quiz') {
      return NextResponse.json(
        { error: 'Chapter is not a quiz' },
        { status: 400 }
      )
    }

    const content = chapter.content as any
    const questions: QuizQuestion[] = content.quiz_questions || []

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'Quiz has no questions' },
        { status: 400 }
      )
    }

    // Calculate score
    const { score, passed, feedback } = calculateQuizScore(questions, body.answers)

    // Save quiz attempt
    const { data: attempt, error: attemptError } = await supabaseAdmin
      .from('quiz_attempts')
      .insert({
        enrollment_id: enrollment.id,
        chapter_id: chapterId,
        answers: body.answers,
        score: score,
        passed: passed,
        attempted_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (attemptError) {
      console.error('Error saving quiz attempt:', attemptError)
      return NextResponse.json(
        { error: 'Failed to save quiz attempt', details: attemptError.message },
        { status: 500 }
      )
    }

    const response: QuizSubmissionResponse = {
      attempt: {
        id: attempt.id,
        enrollment_id: attempt.enrollment_id,
        chapter_id: attempt.chapter_id,
        answers: attempt.answers,
        score: parseFloat(attempt.score || '0'),
        passed: attempt.passed,
        attempted_at: attempt.attempted_at,
        completed_at: attempt.completed_at,
      },
      score,
      passed,
      feedback,
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Unexpected error submitting quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

