import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase/server"

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

    const { data: modules } = await supabaseAdmin
      .from('onboarding_modules')
      .select('id, title, description, order_index, thumbnail')
      .order('order_index')

    const { data: videos } = await supabaseAdmin
      .from('onboarding_videos')
      .select('id, title, description, video_url, video_duration, order_index, thumbnail, module_id')
      .order('order_index')

    const { data: progress } = await supabaseAdmin
      .from('onboarding_progress')
      .select('video_id, completed, completed_at')
      .eq('user_id', user.id)

    const progressMap = new Map(
      (progress || []).map((p: any) => [p.video_id, { completed: p.completed, completed_at: p.completed_at }])
    )

    const videosByModule = new Map<string, any[]>()
    ;(videos || []).forEach((v: any) => {
      if (!videosByModule.has(v.module_id)) {
        videosByModule.set(v.module_id, [])
      }
      videosByModule.get(v.module_id)!.push(v)
    })

    let globalVideoIndex = 0
    const enrichedModules = (modules || []).map((mod: any) => {
      const moduleVideos = (videosByModule.get(mod.id) || [])
        .map((video: any) => {
          globalVideoIndex++
          const isPreview = globalVideoIndex <= PREVIEW_VIDEO_COUNT
          const isAccessible = isPro || isPreview
          const prog = progressMap.get(video.id)

          return {
            ...video,
            module_id: undefined,
            globalIndex: globalVideoIndex,
            isPreview,
            isAccessible,
            completed: prog?.completed || false,
            completedAt: prog?.completed_at || null,
          }
        })

      const completedInModule = moduleVideos.filter((v: any) => v.completed).length
      const totalInModule = moduleVideos.length

      return {
        id: mod.id,
        title: mod.title,
        description: mod.description,
        order_index: mod.order_index,
        thumbnail: mod.thumbnail,
        videos: moduleVideos,
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
