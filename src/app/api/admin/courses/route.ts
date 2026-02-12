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

    // Build query - admin can see all courses
    // Simplified without profiles join - will fetch profiles separately
    let query = supabaseAdmin
      .from('courses')
      .select('*')

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }

    if (level) {
      query = query.eq('level', level)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (published === 'true') {
      query = query.eq('published', true)
    } else if (published === 'false') {
      query = query.eq('published', false)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    // Get total count before pagination
    let countQuery = supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact', head: true })

    if (category) countQuery = countQuery.eq('category', category)
    if (level) countQuery = countQuery.eq('level', level)
    if (featured === 'true') countQuery = countQuery.eq('featured', true)
    if (published === 'true') countQuery = countQuery.eq('published', true)
    if (published === 'false') countQuery = countQuery.eq('published', false)
    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      console.error('Error counting courses:', countError)
    }

    const total = count || 0

    // Apply sorting
    const ascending = sortOrder === 'asc'
    query = query.order(sortBy, { ascending, nullsFirst: false })

    // Apply pagination
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    query = query.range(from, to)

    const { data, error } = await query

    if (error) {
      console.error('Error fetching courses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch courses', details: error.message },
        { status: 500 }
      )
    }

    // Fetch instructor profiles if instructor_id exists
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

    // Transform data to match Course interface
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

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existing } = await supabaseAdmin
      .from('courses')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Course with this slug already exists' },
        { status: 400 }
      )
    }

    // Insert course
    const { data: course, error } = await supabaseAdmin
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

    if (error) {
      console.error('Error creating course:', error)
      return NextResponse.json(
        { error: 'Failed to create course', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { course },
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

