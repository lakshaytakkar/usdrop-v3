import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { CourseDetailResponse } from '@/types/courses'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    console.log('Fetching course with ID:', id)

    const courseResult = await sql`SELECT * FROM courses WHERE id = ${id} LIMIT 1`

    console.log('Course query result:', {
      hasData: courseResult.length > 0,
    })

    if (courseResult.length === 0) {
      console.warn('Course not found for ID:', id)
      return NextResponse.json(
        { error: 'Course not found', courseId: id },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params
    const body = await request.json()

    const {
      title,
      slug,
      description,
      instructor_id,
      thumbnail,
      category,
      level,
      price,
      tags,
      learning_objectives,
      prerequisites,
      featured,
      published,
    } = body

    const setClauses: string[] = []
    const params_arr: unknown[] = []
    let paramIndex = 1

    if (title !== undefined) { setClauses.push(`title = $${paramIndex++}`); params_arr.push(title) }
    if (slug !== undefined) { setClauses.push(`slug = $${paramIndex++}`); params_arr.push(slug) }
    if (description !== undefined) { setClauses.push(`description = $${paramIndex++}`); params_arr.push(description) }
    if (instructor_id !== undefined) { setClauses.push(`instructor_id = $${paramIndex++}`); params_arr.push(instructor_id) }
    if (thumbnail !== undefined) { setClauses.push(`thumbnail = $${paramIndex++}`); params_arr.push(thumbnail) }
    if (category !== undefined) { setClauses.push(`category = $${paramIndex++}`); params_arr.push(category) }
    if (level !== undefined) { setClauses.push(`level = $${paramIndex++}`); params_arr.push(level) }
    if (price !== undefined) { setClauses.push(`price = $${paramIndex++}`); params_arr.push(price) }
    if (tags !== undefined) { setClauses.push(`tags = $${paramIndex++}`); params_arr.push(JSON.stringify(tags)) }
    if (learning_objectives !== undefined) { setClauses.push(`learning_objectives = $${paramIndex++}`); params_arr.push(JSON.stringify(learning_objectives)) }
    if (prerequisites !== undefined) { setClauses.push(`prerequisites = $${paramIndex++}`); params_arr.push(JSON.stringify(prerequisites)) }
    if (featured !== undefined) { setClauses.push(`featured = $${paramIndex++}`); params_arr.push(featured) }
    if (published !== undefined) {
      setClauses.push(`published = $${paramIndex++}`)
      params_arr.push(published)
      if (published && !body.published_at) {
        const existing = await sql`SELECT published_at FROM courses WHERE id = ${id} LIMIT 1`
        if (existing.length > 0 && !existing[0].published_at) {
          setClauses.push(`published_at = $${paramIndex++}`)
          params_arr.push(new Date().toISOString())
        }
      }
    }

    if (slug) {
      const existing = await sql`SELECT id FROM courses WHERE slug = ${slug} AND id != ${id} LIMIT 1`
      if (existing.length > 0) {
        return NextResponse.json(
          { error: 'Course with this slug already exists' },
          { status: 400 }
        )
      }
    }

    if (setClauses.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    setClauses.push(`updated_at = now()`)

    const query = `UPDATE courses SET ${setClauses.join(', ')} WHERE id = $${paramIndex++} RETURNING *`
    params_arr.push(id)

    const result = await sql.unsafe(query, params_arr)

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to update course' },
        { status: 500 }
      )
    }

    return NextResponse.json({ course: result[0] })
  } catch (error) {
    console.error('Unexpected error updating course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id } = await params

    await sql`DELETE FROM courses WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
