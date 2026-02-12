import { NextRequest, NextResponse } from 'next/server'
import sql from '@/lib/db'
import { CourseChapter, ChapterContentType } from '@/types/courses'
import { moveVideoFromTemp } from '@/lib/storage/course-storage'
import { requireAdmin, isAdminResponse } from '@/lib/admin-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
    const authResult = await requireAdmin()
    if (isAdminResponse(authResult)) return authResult
    const { id: courseId, moduleId } = await params
    const body = await request.json()

    const {
      title,
      description,
      content_type,
      content,
      order_index,
      duration_minutes,
      is_preview = false,
    } = body

    if (!title || !content_type || !content) {
      return NextResponse.json(
        { error: 'title, content_type, and content are required' },
        { status: 400 }
      )
    }

    const validContentTypes: ChapterContentType[] = ['video', 'text', 'quiz', 'assignment', 'resource']
    if (!validContentTypes.includes(content_type)) {
      return NextResponse.json(
        { error: `content_type must be one of: ${validContentTypes.join(', ')}` },
        { status: 400 }
      )
    }

    let finalOrderIndex = order_index
    if (finalOrderIndex === undefined) {
      const maxResult = await sql`
        SELECT COALESCE(MAX(order_index), -1) as max_order FROM course_chapters WHERE module_id = ${moduleId}
      `
      finalOrderIndex = maxResult[0].max_order + 1
    }

    let finalContent = content
    if (content_type === 'video' && content?.video_storage_path) {
      const tempPath = content.video_storage_path
      if (tempPath.includes('/temp/')) {
        try {
          const tempResult = await sql`
            INSERT INTO course_chapters (module_id, title, description, content_type, content, order_index, duration_minutes, is_preview)
            VALUES (${moduleId}, ${title}, ${description || null}, ${content_type}, ${JSON.stringify({ ...content, video_storage_path: tempPath })}, ${finalOrderIndex}, ${duration_minutes || null}, ${is_preview || false})
            RETURNING *
          `

          if (!tempResult || tempResult.length === 0) {
            throw new Error('Failed to create chapter for video move')
          }

          const tempChapter = tempResult[0]

          const movedVideo = await moveVideoFromTemp(
            tempPath,
            courseId,
            moduleId,
            tempChapter.id
          )

          finalContent = {
            ...content,
            video_url: movedVideo.url,
            video_storage_path: movedVideo.path,
          }

          const updateResult = await sql`
            UPDATE course_chapters SET content = ${JSON.stringify(finalContent)} WHERE id = ${tempChapter.id} RETURNING *
          `

          if (!updateResult || updateResult.length === 0) {
            await sql`DELETE FROM course_chapters WHERE id = ${tempChapter.id}`
            throw new Error('Failed to update chapter with final video path')
          }

          return NextResponse.json({ chapter: updateResult[0] }, { status: 201 })
        } catch (moveError) {
          console.error('Error moving temp video:', moveError)
          return NextResponse.json(
            { error: 'Failed to move video from temp storage', details: moveError instanceof Error ? moveError.message : 'Unknown error' },
            { status: 500 }
          )
        }
      }
    }

    const result = await sql`
      INSERT INTO course_chapters (module_id, title, description, content_type, content, order_index, duration_minutes, is_preview)
      VALUES (${moduleId}, ${title}, ${description || null}, ${content_type}, ${JSON.stringify(finalContent)}, ${finalOrderIndex}, ${duration_minutes || null}, ${is_preview || false})
      RETURNING *
    `

    if (!result || result.length === 0) {
      return NextResponse.json(
        { error: 'Failed to create chapter' },
        { status: 500 }
      )
    }

    return NextResponse.json({ chapter: result[0] }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
