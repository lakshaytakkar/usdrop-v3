import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
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

    let countQuery = supabaseAdmin.from('courses').select('*', { count: 'exact', head: true })
    let dataQuery = supabaseAdmin.from('courses').select('*')

    if (category) {
      countQuery = countQuery.eq('category', category)
      dataQuery = dataQuery.eq('category', category)
    }
    if (level) {
      countQuery = countQuery.eq('level', level)
      dataQuery = dataQuery.eq('level', level)
    }
    if (featured === 'true') {
      countQuery = countQuery.eq('featured', true)
      dataQuery = dataQuery.eq('featured', true)
    }
    if (published === 'true') {
      countQuery = countQuery.eq('published', true)
      dataQuery = dataQuery.eq('published', true)
    } else if (published === 'false') {
      countQuery = countQuery.eq('published', false)
      dataQuery = dataQuery.eq('published', false)
    }
    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`)
      dataQuery = dataQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    const allowedSortColumns = ['created_at', 'updated_at', 'title', 'price', 'students_count', 'rating', 'published_at']
    const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at'

    dataQuery = dataQuery.order(safeSortBy, { ascending: sortOrder === 'asc', nullsFirst: false })

    const offset = (page - 1) * pageSize
    dataQuery = dataQuery.range(offset, offset + pageSize - 1)

    const [{ count: total }, { data, error }] = await Promise.all([countQuery, dataQuery])

    if (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    const instructorIds = (data || [])
      .map((c: any) => c.instructor_id)
      .filter((id: any) => id !== null)

    let instructorMap: Record<string, { full_name: string | null; avatar_url: string | null }> = {}

    if (instructorIds.length > 0) {
      const { data: profiles } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', instructorIds)

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

    const totalCount = total || 0
    const totalPages = Math.ceil(totalCount / pageSize)

    const response: CoursesResponse = {
      courses,
      total: totalCount,
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

    const { data: existing } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('slug', slug)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { error: 'Course with this slug already exists' },
        { status: 400 }
      )
    }

    const { data: result, error } = await supabaseAdmin
      .from('courses')
      .insert({
        title,
        slug,
        description: description || null,
        instructor_id: instructor_id || null,
        thumbnail: thumbnail || null,
        category: category || null,
        level: level || null,
        price: price || 0,
        tags: tags || [],
        learning_objectives: learning_objectives || [],
        prerequisites: prerequisites || [],
        featured: featured || false,
        published: published || false,
        published_at: published ? new Date().toISOString() : null,
        duration_minutes: 0,
        lessons_count: 0,
        students_count: 0,
      })
      .select()
      .single()

    if (error || !result) {
      console.error('Error creating course:', error)
      return NextResponse.json(
        { error: 'Failed to create course' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { course: result },
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
