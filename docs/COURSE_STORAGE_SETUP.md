# Course Video Storage Setup - Complete Guide

This document describes the complete Supabase Storage setup for course videos and assets.

## Overview

The course management system now supports:
- ✅ **Supabase Storage** for hosting course videos (S3-compatible)
- ✅ **Video Upload** functionality in course builder
- ✅ **Signed URLs** for secure video access
- ✅ **Basic Video Player** component
- ✅ **CDN-like** delivery for course assets

## Architecture

### Storage Buckets

1. **`course-videos`** (Private)
   - Stores all course video files
   - Requires signed URLs for access
   - Organized by: `courses/{courseId}/modules/{moduleId}/chapters/{chapterId}/video.mp4`

2. **`course-assets`** (Public)
   - Stores thumbnails, images, and other assets
   - Publicly accessible via CDN URLs
   - Organized by: `courses/{courseId}/assets/thumbnail.jpg`

### Access Control

- **Videos**: Only enrolled students, instructors, and admins can view
- **Assets**: Publicly accessible
- **Uploads**: Only instructors and admins can upload

## Setup Instructions

### Step 1: Create Storage Buckets

1. Go to Supabase Dashboard → Storage
2. Create two buckets:

#### Bucket 1: `course-videos`
- Name: `course-videos`
- Public: **No** (private)
- File size limit: 500 MB
- Allowed MIME types: `video/*`

#### Bucket 2: `course-assets`
- Name: `course-assets`
- Public: **Yes**
- File size limit: 50 MB
- Allowed MIME types: `image/*`, `application/pdf`

### Step 2: Apply Storage Policies

Run the migration file:
```bash
cd usdrop-v3
# Via Supabase Dashboard SQL Editor:
# Copy and paste contents of: supabase/migrations/004_course_storage.sql
```

Or apply via Supabase CLI:
```bash
supabase db push
```

### Step 3: Verify Environment Variables

Ensure `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Components Created

### 1. Storage Utilities
- **Location**: `src/lib/storage/course-storage.ts`
- **Functions**:
  - `uploadCourseVideo()` - Upload videos to storage
  - `getVideoSignedUrl()` - Generate signed URLs for private videos
  - `uploadCourseAsset()` - Upload thumbnails/assets
  - `deleteCourseVideo()` - Delete videos
  - `listChapterVideos()` - List videos for a chapter

### 2. API Routes

#### Upload Video (Admin)
- **Route**: `POST /api/admin/courses/[id]/modules/[moduleId]/chapters/[chapterId]/upload-video`
- **Purpose**: Upload video files to Supabase Storage
- **Auth**: Requires admin/instructor role
- **Max Size**: 500 MB
- **Formats**: MP4, WebM, OGG, QuickTime

#### Get Video URL (Public)
- **Route**: `GET /api/courses/[id]/chapters/[chapterId]/video`
- **Purpose**: Get signed URL for video playback
- **Auth**: Requires enrollment or preview access
- **Returns**: Signed URL valid for 1 hour

### 3. UI Components

#### VideoUploader
- **Location**: `src/components/courses/video-uploader.tsx`
- **Features**:
  - Drag & drop upload
  - Progress tracking
  - File validation
  - Error handling

#### VideoPlayer
- **Location**: `src/components/courses/video-player.tsx`
- **Features**:
  - Play/Pause controls
  - Volume control
  - Progress bar
  - Fullscreen support
  - Auto-fetch signed URLs
  - Loading states

## Usage

### Uploading Videos (Admin)

1. Go to Course Builder
2. Select a module
3. Click "Add Chapter" or edit existing chapter
4. Select "Video" as content type
5. Use the video uploader to upload a file
6. Or enter a video URL manually

### Displaying Videos (Students)

```tsx
import { VideoPlayer } from '@/components/courses/video-player'

<VideoPlayer
  videoUrl={chapter.content.video_url}
  courseId={courseId}
  chapterId={chapterId}
  autoplay={false}
  controls={true}
  onTimeUpdate={(current, duration) => {
    // Track progress
  }}
  onEnded={() => {
    // Mark as complete
  }}
/>
```

## File Structure

```
usdrop-v3/
├── supabase/
│   └── migrations/
│       └── 004_course_storage.sql        # Storage policies
├── src/
│   ├── lib/
│   │   └── storage/
│   │       └── course-storage.ts         # Storage utilities
│   ├── components/
│   │   └── courses/
│   │       ├── video-player.tsx          # Video player component
│   │       ├── video-uploader.tsx        # Upload component
│   │       └── STORAGE_SETUP.md          # Detailed setup guide
│   └── app/
│       └── api/
│           ├── admin/courses/
│           │   └── [id]/modules/[moduleId]/chapters/[chapterId]/
│           │       └── upload-video/     # Upload API
│           └── courses/
│               └── [id]/chapters/[chapterId]/
│                   └── video/            # Video URL API
└── COURSE_STORAGE_SETUP.md               # This file
```

## Security Features

1. **Private Video Bucket**: Videos are not publicly accessible
2. **Signed URLs**: Time-limited access (1 hour)
3. **Access Control**: 
   - Enrolled students can view
   - Instructors can upload/manage
   - Admins have full access
4. **File Validation**: Type and size checks before upload
5. **RLS Policies**: Database-level access control

## Performance

- **CDN Delivery**: Supabase Storage uses CDN for fast global delivery
- **Signed URLs**: Cached for 1 hour, reduces API calls
- **Progress Tracking**: Real-time upload progress
- **Lazy Loading**: Videos load only when needed

## Future Enhancements

- [ ] Video processing (transcoding, thumbnails)
- [ ] Multiple quality options (720p, 1080p)
- [ ] Video analytics (watch time, completion)
- [ ] Subtitles/closed captions support
- [ ] Advanced video player (Plyr, Video.js integration)
- [ ] Video compression before upload

## Troubleshooting

### Video upload fails
- Check bucket exists in Supabase
- Verify file size < 500 MB
- Check file format is supported
- Verify admin/instructor permissions

### Video won't play
- Check signed URL is valid (< 1 hour old)
- Verify user is enrolled in course
- Check video file exists in storage
- Review browser console for errors

### Access denied
- Verify storage policies are applied
- Check user enrollment status
- Verify RLS policies are correct
- Check user role (student/instructor/admin)

## Support

For issues or questions:
1. Check Supabase Storage dashboard
2. Review browser console errors
3. Check API route logs
4. Verify environment variables
5. Review storage policies

