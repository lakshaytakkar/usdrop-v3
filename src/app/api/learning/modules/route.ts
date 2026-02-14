import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import sql from "@/lib/db"

const PREVIEW_VIDEO_COUNT = 5

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isPro =
      user.account_type === "pro" ||
      ["admin", "super_admin", "editor", "moderator"].includes(user.internal_role || "")

    const modules = await sql`
      SELECT 
        m.id, m.title, m.description, m.order_index, m.thumbnail,
        json_agg(
          json_build_object(
            'id', v.id,
            'title', v.title,
            'description', v.description,
            'video_url', v.video_url,
            'video_duration', v.video_duration,
            'order_index', v.order_index,
            'thumbnail', v.thumbnail
          ) ORDER BY v.order_index
        ) as videos
      FROM onboarding_modules m
      LEFT JOIN onboarding_videos v ON v.module_id = m.id
      GROUP BY m.id, m.title, m.description, m.order_index, m.thumbnail
      ORDER BY m.order_index
    `

    const progress = await sql`
      SELECT video_id, completed, completed_at
      FROM video_progress
      WHERE user_id = ${user.id}
    `

    const progressMap = new Map(
      progress.map((p: any) => [p.video_id, { completed: p.completed, completed_at: p.completed_at }])
    )

    let globalVideoIndex = 0
    const enrichedModules = modules.map((mod: any) => {
      const videos = (mod.videos || [])
        .filter((v: any) => v.id !== null)
        .map((video: any) => {
          globalVideoIndex++
          const isPreview = globalVideoIndex <= PREVIEW_VIDEO_COUNT
          const isAccessible = isPro || isPreview
          const prog = progressMap.get(video.id)

          return {
            ...video,
            globalIndex: globalVideoIndex,
            isPreview,
            isAccessible,
            completed: prog?.completed || false,
            completedAt: prog?.completed_at || null,
          }
        })

      const completedInModule = videos.filter((v: any) => v.completed).length
      const totalInModule = videos.length

      return {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        order_index: mod.order_index,
        thumbnail: mod.thumbnail,
        videos,
        completedCount: completedInModule,
        totalCount: totalInModule,
        isFullyCompleted: totalInModule > 0 && completedInModule === totalInModule,
      }
    })

    const totalVideos = globalVideoIndex
    const totalCompleted = enrichedModules.reduce((sum: number, m: any) => sum + m.completedCount, 0)

    return NextResponse.json({
      modules: enrichedModules,
      isPro,
      previewCount: PREVIEW_VIDEO_COUNT,
      totalVideos,
      totalCompleted,
      progressPercentage: totalVideos > 0 ? Math.round((totalCompleted / totalVideos) * 100) : 0,
    })
  } catch (error: any) {
    console.error("Error fetching learning modules:", error)
    return NextResponse.json(
      { error: "Failed to fetch modules", details: error.message },
      { status: 500 }
    )
  }
}
