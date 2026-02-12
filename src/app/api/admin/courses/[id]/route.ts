import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
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

    // Fetch course without instructor join (will fetch separately)
    const { data: courseData, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    console.log('Course query result:', { 
      hasData: !!courseData, 
      hasError: !!courseError,
      errorCode: courseError?.code,
      errorMessage: courseError?.message 
    })

    if (courseError) {
      console.error('Error fetching course:', {
        code: courseError.code,
        message: courseError.message,
        details: courseError.details,
        hint: courseError.hint
      })
      // Check if it's a "not found" error (PGRST116) or a different error
      if (courseError.code === 'PGRST116' || courseError.message?.includes('No rows') || courseError.message?.includes('not found')) {
        return NextResponse.json(
          { error: 'Course not found', courseId: id },
          { status: 404 }
        )
      }
      // For other errors, return 500 with details
      return NextResponse.json(
        { error: 'Failed to fetch course', details: courseError.message, code: courseError.code },
        { status: 500 }
      )
    }

    if (!courseData) {
      console.warn('Course query succeeded but returned no data for ID:', id)
      return NextResponse.json(
        { error: 'Course not found', courseId: id },
        { status: 404 }
      )
    }

    // Fetch instructor profile separately if instructor_id exists
    let instructorProfile: { full_name: string | null; avatar_url: string | null } | null = null
    if (courseData.instructor_id) {
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', courseData.instructor_id)
        .single()
      
      if (!profileError && profileData) {
        instructorProfile = {
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
        }
      }
    }

    // Fetch modules with chapters
    const { data: modulesData, error: modulesError } = await supabaseAdmin
      .from('course_modules')
      .select(`
        *,
        course_chapters(
          *,
          course_resources(*)
        )
      `)
      .eq('course_id', id)
      .order('order_index', { ascending: true })

    if (modulesError) {
      console.error('Error fetching modules:', modulesError)
    }

    // Sort chapters within each module
    const modules = (modulesData || []).map((module: any) => ({
      ...module,
      chapters: (module.course_chapters || [])
        .sort((a: any, b: any) => a.order_index - b.order_index)
        .map((chapter: any) => ({
          id: chapter.id,
          module_id: chapter.module_id,
          title: chapter.title,
          description: chapter.description,
          content_type: chapter.content_type,
          content: chapter.content,
          order_index: chapter.order_index,
          duration_minutes: chapter.duration_minutes,
          is_preview: chapter.is_preview || false,
          created_at: chapter.created_at,
          updated_at: chapter.updated_at,
          resources: (chapter.course_resources || []).map((resource: any) => ({
            id: resource.id,
            chapter_id: resource.chapter_id,
            name: resource.name,
            url: resource.url,
            type: resource.type,
            size: resource.size,
            created_at: resource.created_at,
          })),
        })),
    }))

    // Transform course data
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

    // Build update object with only provided fields
    const updates: any = {}
    
    if (title !== undefined) updates.title = title
    if (slug !== undefined) updates.slug = slug
    if (description !== undefined) updates.description = description
    if (instructor_id !== undefined) updates.instructor_id = instructor_id
    if (thumbnail !== undefined) updates.thumbnail = thumbnail
    if (category !== undefined) updates.category = category
    if (level !== undefined) updates.level = level
    if (price !== undefined) updates.price = price
    if (tags !== undefined) updates.tags = tags
    if (learning_objectives !== undefined) updates.learning_objectives = learning_objectives
    if (prerequisites !== undefined) updates.prerequisites = prerequisites
    if (featured !== undefined) updates.featured = featured
    if (published !== undefined) {
      updates.published = published
      if (published && !body.published_at) {
        // Set published_at if publishing for the first time
        const { data: existing } = await supabaseAdmin
          .from('courses')
          .select('published_at')
          .eq('id', id)
          .single()
        
        if (!existing?.published_at) {
          updates.published_at = new Date().toISOString()
        }
      }
    }

    // Check if slug is being changed and already exists
    if (slug) {
      const { data: existing } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Course with this slug already exists' },
          { status: 400 }
        )
      }
    }

    const { data: course, error } = await supabaseAdmin
      .from('courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating course:', error)
      return NextResponse.json(
        { error: 'Failed to update course', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ course })
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

    const { error } = await supabaseAdmin
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting course:', error)
      return NextResponse.json(
        { error: 'Failed to delete course', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

