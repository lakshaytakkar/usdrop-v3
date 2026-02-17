import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
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
      const { data: maxResult } = await supabaseAdmin
        .from('course_chapters')
        .select('order_index')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: false })
        .limit(1)

      finalOrderIndex = (maxResult && maxResult.length > 0 ? maxResult[0].order_index : -1) + 1
    }

    let finalContent = content
    if (content_type === 'video' && content?.video_storage_path) {
      const tempPath = content.video_storage_path
      if (tempPath.includes('/temp/')) {
        try {
          const { data: tempChapter, error: tempError } = await supabaseAdmin
            .from('course_chapters')
            .insert({
              module_id: moduleId,
              title,
              description: description || null,
              content_type,
              content: { ...content, video_storage_path: tempPath },
              order_index: finalOrderIndex,
              duration_minutes: duration_minutes || null,
              is_preview: is_preview || false,
            })
            .select()
            .single()

          if (tempError || !tempChapter) {
            throw new Error('Failed to create chapter for video move')
          }

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

          const { data: updateResult, error: updateError } = await supabaseAdmin
            .from('course_chapters')
            .update({ content: finalContent })
            .eq('id', tempChapter.id)
            .select()
            .single()

          if (updateError || !updateResult) {
            await supabaseAdmin.from('course_chapters').delete().eq('id', tempChapter.id)
            throw new Error('Failed to update chapter with final video path')
          }

          return NextResponse.json({ chapter: updateResult }, { status: 201 })
        } catch (moveError) {
          console.error('Error moving temp video:', moveError)
          return NextResponse.json(
            { error: 'Failed to move video from temp storage', details: moveError instanceof Error ? moveError.message : 'Unknown error' },
            { status: 500 }
          )
        }
      }
    }

    const { data: result, error } = await supabaseAdmin
      .from('course_chapters')
      .insert({
        module_id: moduleId,
        title,
        description: description || null,
        content_type,
        content: finalContent,
        order_index: finalOrderIndex,
        duration_minutes: duration_minutes || null,
        is_preview: is_preview || false,
      })
      .select()
      .single()

    if (error || !result) {
      console.error('Error creating chapter:', error)
      return NextResponse.json(
        { error: 'Failed to create chapter' },
        { status: 500 }
      )
    }

    return NextResponse.json({ chapter: result }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
