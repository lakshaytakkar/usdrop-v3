import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('onboarding_completed, onboarding_completed_at, onboarding_progress')
      .eq('id', user.id)
      .single()

    const { count: totalVideos } = await supabaseAdmin
      .from('onboarding_videos')
      .select('id', { count: 'exact', head: true })

    const { count: totalModules } = await supabaseAdmin
      .from('onboarding_modules')
      .select('id', { count: 'exact', head: true })

    const { count: completedVideos } = await supabaseAdmin
      .from('onboarding_progress')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('completed', true)

    const { data: allModules } = await supabaseAdmin
      .from('onboarding_modules')
      .select('id')

    const { data: allVideos } = await supabaseAdmin
      .from('onboarding_videos')
      .select('id, module_id')

    const { data: completedProgress } = await supabaseAdmin
      .from('onboarding_progress')
      .select('video_id')
      .eq('user_id', user.id)
      .eq('completed', true)

    const completedVideoIds = new Set((completedProgress || []).map((p: any) => p.video_id))
    const videosByModule = new Map<string, string[]>()
    for (const video of (allVideos || [])) {
      const moduleVideos = videosByModule.get(video.module_id) || []
      moduleVideos.push(video.id)
      videosByModule.set(video.module_id, moduleVideos)
    }

    let completedModules = 0
    for (const module of (allModules || [])) {
      const moduleVideos = videosByModule.get(module.id) || []
      if (moduleVideos.length > 0 && moduleVideos.every(vid => completedVideoIds.has(vid))) {
        completedModules++
      }
    }

    return NextResponse.json({
      onboarding_completed: profile?.onboarding_completed || false,
      onboarding_completed_at: profile?.onboarding_completed_at || null,
      onboarding_progress: profile?.onboarding_progress || 0,
      completed_videos: completedVideos || 0,
      total_videos: totalVideos || 0,
      completed_modules: completedModules,
      total_modules: totalModules || 0,
    })
  } catch (error) {
    console.error('Onboarding status check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
