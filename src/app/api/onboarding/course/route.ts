import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { OnboardingCourseResponse, OnboardingModule, OnboardingVideo } from '@/types/onboarding'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get the onboarding course modules directly from course_modules
    // The onboarding course has ID '00000000-0000-0000-0000-000000000001'
    // These are now flattened - 6 videos directly (not nested under modules)
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
        video_storage_path,
        video_source,
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

    // Transform course_modules to OnboardingVideo format
    // Since onboarding is flattened, each module IS a video
    // Return each video as its own module entry for direct display
    const transformedVideos: OnboardingVideo[] = (modules || [])
      .filter(module => module.video_url || module.video_storage_path) // Only include videos with URLs
      .map(module => ({
        id: module.id,
        module_id: module.id, // For flattened structure, module_id = id
        title: module.title,
        description: module.description,
        video_url: module.video_url,
        video_storage_path: module.video_storage_path,
        video_source: module.video_source || (module.video_url ? 'embed' : 'upload'), // Determine source based on URL
        video_duration: module.video_duration,
        thumbnail: module.thumbnail,
        order_index: module.order_index,
        created_at: module.created_at,
        updated_at: module.updated_at,
      }))

    // Transform videos back to modules for backward compatibility
    // Each video becomes its own module entry for direct display
    const videoModules: OnboardingModule[] = transformedVideos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      order_index: video.order_index,
      thumbnail: video.thumbnail,
      created_at: video.created_at,
      updated_at: video.updated_at,
      videos: [video], // Each module contains just itself as a video
    }))

    const response: OnboardingCourseResponse = {
      modules: videoModules, // Each video as its own module for direct display
      total_videos: transformedVideos.length,
      total_modules: videoModules.length,
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

