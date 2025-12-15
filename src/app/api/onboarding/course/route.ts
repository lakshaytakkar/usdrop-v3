import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { OnboardingCourseResponse, OnboardingModule } from '@/types/onboarding'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get all modules with their videos, ordered by order_index
    const { data: modules, error: modulesError } = await supabase
      .from('onboarding_modules')
      .select(`
        id,
        title,
        description,
        order_index,
        thumbnail,
        created_at,
        updated_at,
        onboarding_videos (
          id,
          module_id,
          title,
          description,
          video_url,
          video_duration,
          thumbnail,
          order_index,
          created_at,
          updated_at
        )
      `)
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

    // Sort videos within each module by order_index
    const modulesWithSortedVideos = (modules || []).map(module => ({
      ...module,
      onboarding_videos: (module.onboarding_videos || []).sort((a, b) => 
        a.order_index - b.order_index
      ),
    }))

    // Calculate total videos
    const totalVideos = modulesWithSortedVideos.reduce(
      (sum, module) => sum + (module.onboarding_videos?.length || 0),
      0
    )

    const response: OnboardingCourseResponse = {
      modules: modulesWithSortedVideos as OnboardingModule[],
      total_videos: totalVideos,
      total_modules: modulesWithSortedVideos.length,
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

