import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CompleteVideoRequest } from '@/types/onboarding'

export async function POST(request: Request) {
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

    const body: CompleteVideoRequest = await request.json()
    const { video_id, watch_duration } = body

    if (!video_id) {
      return NextResponse.json(
        { error: 'video_id is required' },
        { status: 400 }
      )
    }

    // Verify video exists and get module_id
    const { data: video, error: videoError } = await supabase
      .from('onboarding_videos')
      .select('id, module_id')
      .eq('id', video_id)
      .single()

    if (videoError || !video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      )
    }

    // Check if progress record exists
    const { data: existingProgress } = await supabase
      .from('onboarding_progress')
      .select('id, completed')
      .eq('user_id', user.id)
      .eq('video_id', video_id)
      .single()

    const progressData = {
      user_id: user.id,
      video_id,
      module_id: video.module_id,
      completed: true,
      completed_at: new Date().toISOString(),
      watch_duration: watch_duration || 0,
      updated_at: new Date().toISOString(),
    }

    let result
    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabase
        .from('onboarding_progress')
        .update(progressData)
        .eq('id', existingProgress.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating progress:', error)
        return NextResponse.json(
          { error: 'Failed to mark video as complete' },
          { status: 500 }
        )
      }

      result = data
    } else {
      // Create new progress record
      const { data, error } = await supabase
        .from('onboarding_progress')
        .insert({
          ...progressData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating progress:', error)
        return NextResponse.json(
          { error: 'Failed to mark video as complete' },
          { status: 500 }
        )
      }

      result = data
    }

    // Update overall progress percentage and check if all videos are completed
    await updateUserProgressPercentage(supabase, user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error completing video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to update user's overall progress percentage
async function updateUserProgressPercentage(supabase: any, userId: string) {
  try {
    // Get total videos count
    const { count: totalVideos } = await supabase
      .from('onboarding_videos')
      .select('*', { count: 'exact', head: true })

    if (!totalVideos || totalVideos === 0) {
      return
    }

    // Get completed videos count
    const { count: completedVideos } = await supabase
      .from('onboarding_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true)

    const progressPercentage = Math.round(
      ((completedVideos || 0) / totalVideos) * 100
    )

    // Check if all videos are completed
    const allCompleted = completedVideos === totalVideos

    // Update profile
    const updateData: any = {
      onboarding_progress: progressPercentage,
      updated_at: new Date().toISOString(),
    }

    if (allCompleted) {
      updateData.onboarding_completed = true
      // Only set completed_at if not already set
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed_at')
        .eq('id', userId)
        .single()

      if (!profile?.onboarding_completed_at) {
        updateData.onboarding_completed_at = new Date().toISOString()
      }
    }

    await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
  } catch (error) {
    console.error('Error updating progress percentage:', error)
  }
}

