import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import sql from "@/lib/db"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const progress = await sql`
      SELECT vp.video_id, vp.completed, vp.completed_at
      FROM video_progress vp
      WHERE vp.user_id = ${user.id}
    `

    const totalVideos = await sql`
      SELECT COUNT(*) as count FROM onboarding_videos
    `

    const completedCount = progress.filter((p: any) => p.completed).length
    const totalCount = parseInt(totalVideos[0]?.count || "0")

    return NextResponse.json({
      progress,
      completedCount,
      totalCount,
      percentage: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
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

    const videoExists = await sql`
      SELECT id FROM onboarding_videos WHERE id = ${videoId}
    `
    if (videoExists.length === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    const completedAt = completed !== false ? new Date().toISOString() : null

    await sql`
      INSERT INTO video_progress (user_id, video_id, completed, completed_at)
      VALUES (${user.id}, ${videoId}, ${completed !== false}, ${completedAt})
      ON CONFLICT (user_id, video_id)
      DO UPDATE SET 
        completed = ${completed !== false},
        completed_at = ${completedAt},
        updated_at = now()
    `

    return NextResponse.json({ success: true, videoId, completed: completed !== false })
  } catch (error: any) {
    console.error("Error updating learning progress:", error)
    return NextResponse.json(
      { error: "Failed to update progress", details: error.message },
      { status: 500 }
    )
  }
}
