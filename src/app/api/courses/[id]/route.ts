import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { CourseDetailResponse } from '@/types/courses'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const courseResult = await sql`SELECT * FROM courses WHERE id = ${id} LIMIT 1`

    if (courseResult.length === 0) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    const courseData = courseResult[0]

    let instructorProfile: { full_name: string | null; avatar_url: string | null } | null = null
    if (courseData.instructor_id) {
      const profileResult = await sql`
        SELECT id, full_name, avatar_url FROM profiles WHERE id = ${courseData.instructor_id} LIMIT 1
      `
      if (profileResult.length > 0) {
        instructorProfile = {
          full_name: profileResult[0].full_name,
          avatar_url: profileResult[0].avatar_url,
        }
      }
    }

    const modulesData = await sql`
      SELECT * FROM course_modules WHERE course_id = ${id} ORDER BY order_index ASC
    `

    const modules = modulesData.map((module: any) => ({
      ...module,
      chapters: [],
    }))

    const course = {
      id: courseData.id,
      title: courseData.title,
      slug: courseData.slug,
      description: courseData.description,
      instructor_id: courseData.instructor_id,
      thumbnail: courseData.thumbnail,
      duration_minutes: courseData.duration_minutes,
      lessons_count: courseData.lessons_count || 0,
      students_count: courseData.students_count || 0,
      rating: courseData.rating ? parseFloat(courseData.rating) : null,
      price: parseFloat(courseData.price || '0'),
      category: courseData.category,
      level: courseData.level,
      featured: courseData.featured || false,
      published: courseData.published || false,
      published_at: courseData.published_at,
      tags: courseData.tags || [],
      learning_objectives: courseData.learning_objectives || [],
      prerequisites: courseData.prerequisites || [],
      created_at: courseData.created_at,
      updated_at: courseData.updated_at,
      instructor_name: instructorProfile?.full_name || undefined,
      instructor_avatar: instructorProfile?.avatar_url || undefined,
      modules,
    }

    const response: CourseDetailResponse = {
      course,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error fetching course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
