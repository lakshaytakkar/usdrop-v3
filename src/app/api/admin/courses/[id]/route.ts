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

    const { data: courseData, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (courseError || !courseData) {
      return NextResponse.json(
        { error: 'Course not found', courseId: id },
        { status: 404 }
      )
    }

    let instructorProfile: { full_name: string | null; avatar_url: string | null } | null = null
    if (courseData.instructor_id) {
      const { data: profileResult } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', courseData.instructor_id)
        .single()

      if (profileResult) {
        instructorProfile = {
          full_name: profileResult.full_name,
          avatar_url: profileResult.avatar_url,
        }
      }
    }

    const { data: modulesData } = await supabaseAdmin
      .from('course_modules')
      .select('*')
      .eq('course_id', id)
      .order('order_index', { ascending: true })

    const modules = (modulesData || []).map((module: any) => ({
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

    const updateData: Record<string, any> = {}

    if (title !== undefined) updateData.title = title
    if (slug !== undefined) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (instructor_id !== undefined) updateData.instructor_id = instructor_id
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail
    if (category !== undefined) updateData.category = category
    if (level !== undefined) updateData.level = level
    if (price !== undefined) updateData.price = price
    if (tags !== undefined) updateData.tags = tags
    if (learning_objectives !== undefined) updateData.learning_objectives = learning_objectives
    if (prerequisites !== undefined) updateData.prerequisites = prerequisites
    if (featured !== undefined) updateData.featured = featured
    if (published !== undefined) {
      updateData.published = published
      if (published && !body.published_at) {
        const { data: existing } = await supabaseAdmin
          .from('courses')
          .select('published_at')
          .eq('id', id)
          .single()

        if (existing && !existing.published_at) {
          updateData.published_at = new Date().toISOString()
        }
      }
    }

    if (slug) {
      const { data: existing } = await supabaseAdmin
        .from('courses')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .limit(1)

      if (existing && existing.length > 0) {
        return NextResponse.json(
          { error: 'Course with this slug already exists' },
          { status: 400 }
        )
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateData.updated_at = new Date().toISOString()

    const { data: result, error } = await supabaseAdmin
      .from('courses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error || !result) {
      return NextResponse.json(
        { error: 'Failed to update course' },
        { status: 500 }
      )
    }

    return NextResponse.json({ course: result })
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

    await supabaseAdmin.from('courses').delete().eq('id', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error deleting course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
