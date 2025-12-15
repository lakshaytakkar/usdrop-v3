import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CourseDetailResponse } from '@/types/courses'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch course without instructor join (will fetch separately)
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

