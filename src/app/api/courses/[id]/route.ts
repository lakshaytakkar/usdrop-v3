import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CourseDetailResponse } from '@/types/courses'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: courseData, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()

    if (courseError || !courseData) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    let instructorProfile: { full_name: string | null; avatar_url: string | null } | null = null
    if (courseData.instructor_id) {
      const { data: profileData } = await supabaseAdmin
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', courseData.instructor_id)
        .single()

      if (profileData) {
        instructorProfile = {
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
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
