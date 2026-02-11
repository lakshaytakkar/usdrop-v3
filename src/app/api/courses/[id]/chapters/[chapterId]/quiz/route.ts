import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { QuizSubmissionRequest, QuizSubmissionResponse, QuizQuestion } from '@/types/courses'

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
  const passed = score >= 70

  return { score, passed, feedback }
}

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
    const body: QuizSubmissionRequest = await request.json()

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

    const { score, passed, feedback } = calculateQuizScore(questions, body.answers)

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
