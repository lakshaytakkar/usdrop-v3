import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase/server"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: progress } = await supabaseAdmin
      .from('onboarding_progress')
      .select('video_id, completed, completed_at')
      .eq('user_id', user.id)

    const { count: totalCount } = await supabaseAdmin
      .from('onboarding_videos')
      .select('*', { count: 'exact', head: true })

    const completedCount = (progress || []).filter((p: any) => p.completed).length
    const total = totalCount || 0

    return NextResponse.json({
      progress: progress || [],
      completedCount,
      totalCount: total,
      percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
    })
  } catch (error: any) {
    console.error("Error fetching learning progress:", error)
    return NextResponse.json(
      { error: "Failed to fetch progress", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { videoId, completed } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: "videoId is required" }, { status: 400 })
    }

    const { data: video } = await supabaseAdmin
      .from('onboarding_videos')
      .select('id')
      .eq('id', videoId)
      .single()

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const completedAt = completed !== false ? new Date().toISOString() : null
    const isCompleted = completed !== false

    const { error } = await supabaseAdmin
      .from('onboarding_progress')
      .upsert({
        user_id: user.id,
        video_id: videoId,
        completed: isCompleted,
        completed_at: completedAt,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,video_id' })

    if (error) {
      console.error("Error upserting progress:", error)
      return NextResponse.json({ error: "Failed to update progress" }, { status: 500 })
    }

    return NextResponse.json({ success: true, videoId, completed: isCompleted })
  } catch (error: any) {
    console.error("Error updating learning progress:", error)
    return NextResponse.json(
      { error: "Failed to update progress", details: error.message },
      { status: 500 }
    )
  }
}
