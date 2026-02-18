import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const adminCheck = await requireAdmin()
  if (isAdminResponse(adminCheck)) return adminCheck

  try {
    const { userId } = await params

    const [
      roadmapResult,
      onboardingResult,
      userDetailsResult,
      credentialsResult,
      courseNotesResult,
    ] = await Promise.all([
      supabaseAdmin
        .from('roadmap_progress')
        .select('*')
        .eq('user_id', userId),

      supabaseAdmin
        .from('onboarding_progress')
        .select('*, onboarding_videos(*)')
        .eq('user_id', userId),

      supabaseAdmin
        .from('user_details')
        .select('*')
        .eq('user_id', userId),

      supabaseAdmin
        .from('user_credentials')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),

      supabaseAdmin
        .from('course_notes')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
    ])

    return NextResponse.json({
      roadmapProgress: roadmapResult.data ?? [],
      onboardingProgress: onboardingResult.data ?? [],
      userDetails: userDetailsResult.data ?? [],
      credentialsCount: credentialsResult.count ?? 0,
      courseNotesCount: courseNotesResult.count ?? 0,
    })
  } catch (error) {
    console.error('Error in GET /api/admin/user-progress/[userId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
