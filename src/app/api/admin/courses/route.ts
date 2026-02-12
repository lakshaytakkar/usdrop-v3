import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { CoursesResponse, CourseQueryParams } from '@/types/courses'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    const conditions: string[] = []
    const params: unknown[] = []
    let paramIndex = 1

    if (category) {
      conditions.push(`category = $${paramIndex++}`)
      params.push(category)
    }

    if (level) {
      conditions.push(`level = $${paramIndex++}`)
      params.push(level)
    }

    if (featured === 'true') {
      conditions.push(`featured = true`)
    }

    if (published === 'true') {
      conditions.push(`published = true`)
    } else if (published === 'false') {
      conditions.push(`published = false`)
    }

    if (search) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex} OR slug ILIKE $${paramIndex})`)
      params.push(`%${search}%`)
      paramIndex++
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const allowedSortColumns = ['created_at', 'updated_at', 'title', 'price', 'students_count', 'rating', 'published_at']
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at'
    const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC'

    const offset = (page - 1) * pageSize

    const countQuery = `SELECT COUNT(*) as total FROM courses ${whereClause}`
    const countResult = await sql.unsafe(countQuery, params)
    const total = parseInt(countResult[0]?.total || '0')

    const dataQuery = `
      SELECT * FROM courses
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeSortOrder} NULLS LAST
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `
    const dataParams = [...params, pageSize, offset]
    const data = await sql.unsafe(dataQuery, dataParams)

    const instructorIds = (data || [])
      .map((c: any) => c.instructor_id)
      .filter((id: any) => id !== null)

    let instructorMap: Record<string, { full_name: string | null; avatar_url: string | null }> = {}

    if (instructorIds.length > 0) {
      const profiles = await sql`
        SELECT id, full_name, avatar_url FROM profiles WHERE id = ANY(${instructorIds})
      `

      if (profiles) {
        profiles.forEach((profile: any) => {
          instructorMap[profile.id] = {
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          }
        })
      }
    }

    const courses = (data || []).map((course: any) => {
      const instructor = course.instructor_id ? instructorMap[course.instructor_id] : null

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        description: course.description,
        instructor_id: course.instructor_id,
        thumbnail: course.thumbnail,
        duration_minutes: course.duration_minutes,
        lessons_count: course.lessons_count || 0,
        students_count: course.students_count || 0,
        rating: course.rating ? parseFloat(course.rating) : null,
        price: parseFloat(course.price || '0'),
        category: course.category,
        level: course.level,
        featured: course.featured || false,
        published: course.published || false,
        published_at: course.published_at,
        tags: course.tags || [],
        learning_objectives: course.learning_objectives || [],
        prerequisites: course.prerequisites || [],
        created_at: course.created_at,
        updated_at: course.updated_at,
        instructor_name: instructor?.full_name || undefined,
        instructor_avatar: instructor?.avatar_url || undefined,
      }
    })

    const totalPages = Math.ceil(total / pageSize)

    const response: CoursesResponse = {
      courses,
      total,
      page,
      pageSize,
      totalPages,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Unexpected error fetching courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const body = await request.json()
    const {
      title,
      slug,
      description,
      instructor_id,
      thumbnail,
      category,
      level,
      price = 0,
      tags = [],
      learning_objectives = [],
      prerequisites = [],
      featured = false,
      published = false,
    } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug' },
        { status: 400 }
      )
    }

    const existing = await sql`SELECT id FROM courses WHERE slug = ${slug} LIMIT 1`

    if (existing.length > 0) {
      return NextResponse.json(
        { error: 'Course with this slug already exists' },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO courses (
        title, slug, description, instructor_id, thumbnail,
        category, level, price, tags, learning_objectives,
        prerequisites, featured, published, published_at,
        duration_minutes, lessons_count, students_count
      ) VALUES (
        ${title}, ${slug}, ${description || null}, ${instructor_id || null}, ${thumbnail || null},
        ${category || null}, ${level || null}, ${price || 0}, ${JSON.stringify(tags || [])}, ${JSON.stringify(learning_objectives || [])},
        ${JSON.stringify(prerequisites || [])}, ${featured || false}, ${published || false}, ${published ? new Date().toISOString() : null},
        ${0}, ${0}, ${0}
      )
      RETURNING *
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { course: result[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error creating course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
