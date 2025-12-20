import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { OnboardingCourseResponse, OnboardingModule } from '@/types/onboarding'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the onboarding course modules (chapters) directly from course_modules
    // The onboarding course has ID '00000000-0000-0000-0000-000000000001'
    const { data: modules, error: modulesError } = await supabase
      .from('course_modules')
      .select(`
        id,
        title,
        description,
        order_index,
        thumbnail,
        content_type,
        content,
        video_url,
        video_duration,
        created_at,
        updated_at
      `)
      .eq('course_id', '00000000-0000-0000-0000-000000000001')
      .order('order_index', { ascending: true })

    if (modulesError) {
      console.error('Error fetching modules:', modulesError)
      // If table doesn't exist, return empty course structure
      if (modulesError.code === '42P01' || modulesError.message?.includes('does not exist')) {
        return NextResponse.json({
          modules: [],
          total_videos: 0,
          total_modules: 0,
        })
      }
      return NextResponse.json(
        { error: 'Failed to fetch onboarding course', details: modulesError.message },
        { status: 500 }
      )
    }

    // Transform course_modules to OnboardingModule format
    // Since we have 6 chapters with no sub-modules or videos, we map them directly
    const transformedModules: OnboardingModule[] = (modules || []).map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      order_index: module.order_index,
      thumbnail: module.thumbnail,
      created_at: module.created_at,
      updated_at: module.updated_at,
      onboarding_videos: [], // No videos - just 6 chapters
    }))

    const response: OnboardingCourseResponse = {
      modules: transformedModules,
      total_videos: 0, // No videos in the new structure
      total_modules: transformedModules.length,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching onboarding course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

