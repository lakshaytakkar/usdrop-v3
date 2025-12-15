import { NextRequest, NextResponse } from 'next/server'
import { getVideoSignedUrl } from '@/lib/storage/course-storage'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; moduleId: string; chapterId: string }> }
) {
  try {
    const { id: courseId, moduleId, chapterId } = await params
    const searchParams = request.nextUrl.searchParams
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      )
    }

    // Generate signed URL (valid for 1 hour)
    const signedUrl = await getVideoSignedUrl(path, 3600)

    return NextResponse.json({ url: signedUrl })
  } catch (error) {
    console.error('Error generating video URL:', error)
    return NextResponse.json(
      { error: 'Failed to generate video URL' },
      { status: 500 }
    )
  }
}







