import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { OnboardingProgressResponse, UpdateProgressRequest, OnboardingStatus } from '@/types/onboarding'

// GET - Fetch user's progress
export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: progress, error: progressError } = await supabaseAdmin
      .from('onboarding_progress')
      .select(`
        id,
        user_id,
        video_id,
        completed,
        completed_at,
        watch_time,
        created_at,
        updated_at,
        onboarding_videos (
          id,
          title,
          video_url,
          video_duration
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (progressError) {
      console.error('Error fetching progress:', progressError)
      return NextResponse.json(
        { error: 'Failed to fetch progress' },
        { status: 500 }
      )
    }

    // Get status information
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('onboarding_completed, onboarding_completed_at, onboarding_progress')
      .eq('id', user.id)
      .single()

    const { count: totalVideos } = await supabaseAdmin
      .from('onboarding_videos')
      .select('*', { count: 'exact', head: true })

    const { count: totalModules } = await supabaseAdmin
      .from('onboarding_modules')
      .select('*', { count: 'exact', head: true })

    const completedVideos = progress?.filter(p => p.completed).length || 0

    const status: OnboardingStatus = {
      onboarding_completed: profile?.onboarding_completed || false,
      onboarding_completed_at: profile?.onboarding_completed_at || null,
      onboarding_progress: profile?.onboarding_progress || 0,
      completed_videos: completedVideos,
      total_videos: totalVideos || 0,
      completed_modules: 0, // Will be calculated if needed
      total_modules: totalModules || 0,
    }

    const response: OnboardingProgressResponse = {
      progress: progress || [],
      status,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching onboarding progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Update video progress
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body: UpdateProgressRequest = await request.json()
    const { video_id, completed } = body
    const watch_time = (body as any).watch_duration || (body as any).watch_time

    if (!video_id) {
      return NextResponse.json(
        { error: 'video_id is required' },
        { status: 400 }
      )
    }

    // Verify video exists
    const { data: video, error: videoError } = await supabaseAdmin
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

    const { data: existingProgress } = await supabaseAdmin
      .from('onboarding_progress')
      .select('id, completed, watch_time')
      .eq('user_id', user.id)
      .eq('video_id', video_id)
      .single()

    const updateData: any = {
      user_id: user.id,
      video_id,
      updated_at: new Date().toISOString(),
    }

    if (watch_time !== undefined) {
      updateData.watch_time = Math.max(
        existingProgress?.watch_time || 0,
        watch_time
      )
    }

    if (completed !== undefined) {
      updateData.completed = completed
      if (completed && !existingProgress?.completed) {
        updateData.completed_at = new Date().toISOString()
      }
    }

    let result
    if (existingProgress) {
      // Update existing progress
      const { data, error } = await supabaseAdmin
        .from('onboarding_progress')
        .update(updateData)
        .eq('id', existingProgress.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating progress:', error)
        return NextResponse.json(
          { error: 'Failed to update progress' },
          { status: 500 }
        )
      }

      result = data
    } else {
      // Create new progress record
      const { data, error } = await supabaseAdmin
        .from('onboarding_progress')
        .insert({
          ...updateData,
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating progress:', error)
        return NextResponse.json(
          { error: 'Failed to create progress' },
          { status: 500 }
        )
      }

      result = data
    }

    // Update overall progress percentage in profile
    await updateUserProgressPercentage(user.id)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating onboarding progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to update user's overall progress percentage
async function updateUserProgressPercentage(userId: string) {
  try {
    // Get total videos count
    const { count: totalVideos } = await supabaseAdmin
      .from('onboarding_videos')
      .select('*', { count: 'exact', head: true })

    if (!totalVideos || totalVideos === 0) {
      return
    }

    // Get completed videos count
    const { count: completedVideos } = await supabaseAdmin
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
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('onboarding_completed_at')
        .eq('id', userId)
        .single()

      if (!profile?.onboarding_completed_at) {
        updateData.onboarding_completed_at = new Date().toISOString()
      }
    }

    await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
  } catch (error) {
    console.error('Error updating progress percentage:', error)
  }
}
