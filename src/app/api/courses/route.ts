import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CoursesResponse, CourseQueryParams } from '@/types/courses'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const published = searchParams.get('published') ?? 'true' // Default to published only for public
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    // Build base query - we exclude onboarding course(s) by default
    // so they don't appear in the main Academy / mentor experiences.
    // If we ever need to include them, we can add a dedicated query param.
    let query = supabaseAdmin
      .from('courses')
      .select('*')
      .eq('is_onboarding', false)

    // Apply filters - public route only shows published courses
    if (published === 'true') {
      query = query.eq('published', true)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (level) {
      query = query.eq('level', level)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    // Get total count before pagination (apply same filters as main query)
    let countQuery = supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact', head: true })
      .eq('is_onboarding', false)
    
    if (published === 'true') {
      countQuery = countQuery.eq('published', true)
    }
    
    if (category) {
      countQuery = countQuery.eq('category', category)
    }
    
    if (level) {
      countQuery = countQuery.eq('level', level)
    }
    
    if (featured === 'true') {
      countQuery = countQuery.eq('featured', true)
    }
    
    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,slug.ilike.%${search}%`)
    }

    const { count } = await countQuery
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
        is_onboarding: course.is_onboarding ?? false,
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

