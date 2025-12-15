import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { CourseChapter, ChapterContentType } from '@/types/courses'
import { moveVideoFromTemp } from '@/lib/storage/course-storage'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string }> }
) {
  try {
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

    // Validate content_type
    const validContentTypes: ChapterContentType[] = ['video', 'text', 'quiz', 'assignment', 'resource']
    if (!validContentTypes.includes(content_type)) {
      return NextResponse.json(
        { error: `content_type must be one of: ${validContentTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Get max order_index if not provided (calculate once)
    let finalOrderIndex = order_index
    if (finalOrderIndex === undefined) {
      const { data: chapters } = await supabaseAdmin
        .from('course_chapters')
        .select('order_index')
        .eq('module_id', moduleId)
        .order('order_index', { ascending: false })
        .limit(1)

      finalOrderIndex = chapters && chapters.length > 0
        ? chapters[0].order_index + 1
        : 0
    }

    // Check if content contains a temp video path and move it to final location
    let finalContent = content
    if (content_type === 'video' && content?.video_storage_path) {
      const tempPath = content.video_storage_path
      // Check if it's a temp path (contains /temp/ in the path)
      if (tempPath.includes('/temp/')) {
        try {
          // Create chapter first to get the chapterId
          const { data: tempChapter, error: tempError } = await supabaseAdmin
            .from('course_chapters')
            .insert({
              module_id: moduleId,
              title,
              description: description || null,
              content_type,
              content: { ...content, video_storage_path: tempPath }, // Temporary content
              order_index: finalOrderIndex,
              duration_minutes: duration_minutes || null,
              is_preview: is_preview || false,
            })
            .select()
            .single()

          if (tempError || !tempChapter) {
            throw new Error('Failed to create chapter for video move')
          }

          // Move video from temp to final location
          const movedVideo = await moveVideoFromTemp(
            tempPath,
            courseId,
            moduleId,
            tempChapter.id
          )

          // Update content with final video path
          finalContent = {
            ...content,
            video_url: movedVideo.url,
            video_storage_path: movedVideo.path,
          }

          // Update chapter with final content
          const { data: chapter, error: updateError } = await supabaseAdmin
            .from('course_chapters')
            .update({
              content: finalContent,
            })
            .eq('id', tempChapter.id)
            .select()
            .single()

          if (updateError) {
            // Cleanup: delete the temp chapter if update fails
            await supabaseAdmin
              .from('course_chapters')
              .delete()
              .eq('id', tempChapter.id)

            throw updateError
          }

          return NextResponse.json({ chapter }, { status: 201 })
        } catch (moveError) {
          console.error('Error moving temp video:', moveError)
          return NextResponse.json(
            { error: 'Failed to move video from temp storage', details: moveError instanceof Error ? moveError.message : 'Unknown error' },
            { status: 500 }
          )
        }
      }
    }

    const { data: chapter, error } = await supabaseAdmin
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

    if (error) {
      console.error('Error creating chapter:', error)
      return NextResponse.json(
        { error: 'Failed to create chapter', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ chapter }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error creating chapter:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

