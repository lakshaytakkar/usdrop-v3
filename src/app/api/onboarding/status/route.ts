import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { OnboardingStatus } from '@/types/onboarding'

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user profile with onboarding fields
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarding_completed_at, onboarding_progress')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch profile' },
        { status: 500 }
      )
    }

    // Get total count of videos
    const { count: totalVideosCount, error: videosError } = await supabase
      .from('onboarding_videos')
      .select('*', { count: 'exact', head: true })

    // Handle case where tables might not exist yet
    let totalVideos = 0
    let totalModules = 0
    let completedVideos = 0

    if (videosError) {
      console.error('Error counting videos:', videosError)
      // If table doesn't exist, use defaults
      if (videosError.code === '42P01' || videosError.message?.includes('does not exist')) {
        totalVideos = 0
      } else {
        return NextResponse.json(
          { error: 'Failed to count videos', details: videosError.message },
          { status: 500 }
        )
      }
    } else {
      totalVideos = totalVideosCount || 0
    }

    // Get total count of modules
    const { count: totalModulesCount, error: modulesError } = await supabase
      .from('onboarding_modules')
      .select('*', { count: 'exact', head: true })

    if (modulesError) {
      console.error('Error counting modules:', modulesError)
      // If table doesn't exist, use defaults
      if (modulesError.code === '42P01' || modulesError.message?.includes('does not exist')) {
        totalModules = 0
      } else {
        return NextResponse.json(
          { error: 'Failed to count modules', details: modulesError.message },
          { status: 500 }
        )
      }
    } else {
      totalModules = totalModulesCount || 0
    }

    // Get completed videos count
    const { count: completedVideosCount, error: progressError } = await supabase
      .from('onboarding_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true)

    if (progressError) {
      console.error('Error counting completed videos:', progressError)
      // If table doesn't exist, use defaults
      if (progressError.code === '42P01' || progressError.message?.includes('does not exist')) {
        completedVideos = 0
      } else {
        return NextResponse.json(
          { error: 'Failed to count progress', details: progressError.message },
          { status: 500 }
        )
      }
    } else {
      completedVideos = completedVideosCount || 0
    }

    // Get completed modules (modules where all videos are completed)
    const { data: completedModulesData, error: completedModulesError } = await supabase
      .from('onboarding_modules')
      .select(`
        id,
        onboarding_videos!inner(id),
        onboarding_progress!inner(user_id, completed)
      `)
      .eq('onboarding_progress.user_id', user.id)
      .eq('onboarding_progress.completed', true)

    // Count unique completed modules
    const completedModules = completedModulesData 
      ? new Set(completedModulesData.map(m => m.id)).size 
      : 0

    const status: OnboardingStatus = {
      onboarding_completed: profile?.onboarding_completed || false,
      onboarding_completed_at: profile?.onboarding_completed_at || null,
      onboarding_progress: profile?.onboarding_progress || 0,
      completed_videos: completedVideos,
      total_videos: totalVideos,
      completed_modules: completedModules,
      total_modules: totalModules,
    }

    return NextResponse.json(status)
  } catch (error) {
    console.error('Onboarding status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

