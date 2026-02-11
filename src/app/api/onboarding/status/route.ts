import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import sql from '@/lib/db'

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profiles = await sql`
      SELECT onboarding_completed, onboarding_completed_at, onboarding_progress
      FROM profiles WHERE id = ${user.id} LIMIT 1
    `
    const profile = profiles[0] || null

    const videosCount = await sql`SELECT COUNT(*)::int as count FROM onboarding_videos`
    const totalVideos = videosCount[0]?.count || 0

    const modulesCount = await sql`SELECT COUNT(*)::int as count FROM onboarding_modules`
    const totalModules = modulesCount[0]?.count || 0

    const completedCount = await sql`
      SELECT COUNT(*)::int as count FROM onboarding_progress
      WHERE user_id = ${user.id} AND completed = true
    `
    const completedVideos = completedCount[0]?.count || 0

    const completedModulesResult = await sql`
      SELECT COUNT(DISTINCT om.id)::int as count
      FROM onboarding_modules om
      WHERE NOT EXISTS (
        SELECT 1 FROM onboarding_videos ov
        WHERE ov.module_id = om.id
        AND NOT EXISTS (
          SELECT 1 FROM onboarding_progress op
          WHERE op.video_id = ov.id AND op.user_id = ${user.id} AND op.completed = true
        )
      )
      AND EXISTS (SELECT 1 FROM onboarding_videos ov2 WHERE ov2.module_id = om.id)
    `
    const completedModules = completedModulesResult[0]?.count || 0

    return NextResponse.json({
      onboarding_completed: profile?.onboarding_completed || false,
      onboarding_completed_at: profile?.onboarding_completed_at || null,
      onboarding_progress: profile?.onboarding_progress || 0,
      completed_videos: completedVideos,
      total_videos: totalVideos,
      completed_modules: completedModules,
      total_modules: totalModules,
    })
  } catch (error) {
    console.error('Onboarding status check error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
