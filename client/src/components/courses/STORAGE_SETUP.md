# Supabase Storage Setup Guide for Course Videos

This guide will help you set up Supabase Storage buckets for course videos and assets.

## Prerequisites

1. Access to your Supabase project dashboard
2. Admin permissions to create storage buckets

## Step 1: Create Storage Buckets

### Option A: Via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the sidebar
3. Click **New bucket**

#### Create `course-videos` bucket:
- **Name**: `course-videos`
- **Public bucket**: ❌ **No** (private bucket)
- **File size limit**: 500 MB (or as needed)
- **Allowed MIME types**: `video/*`
- Click **Create bucket**

#### Create `course-assets` bucket:
- **Name**: `course-assets`
- **Public bucket**: ✅ **Yes** (public bucket for thumbnails, images)
- **File size limit**: 50 MB (or as needed)
- **Allowed MIME types**: `image/*`, `application/pdf`
- Click **Create bucket**

### Option B: Via SQL (Alternative)

You can also create buckets programmatically using the Supabase SQL editor:

```sql
-- Create course-videos bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-videos', 'course-videos', false)
ON CONFLICT (id) DO NOTHING;

-- Create course-assets bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-assets', 'course-assets', true)
ON CONFLICT (id) DO NOTHING;
```

## Step 2: Apply Storage Policies

The storage policies are defined in the migration file:
`usdrop-v3/supabase/migrations/004_course_storage.sql`

Apply this migration using one of these methods:

### Option A: Via Supabase Dashboard

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `004_course_storage.sql`
3. Paste and run the SQL

### Option B: Via Supabase CLI

```bash
cd usdrop-v3
supabase db push
```

## Step 3: Verify Setup

After creating buckets and applying policies, verify:

1. **Check buckets exist**:
   - Go to Storage → Buckets
   - Confirm both `course-videos` and `course-assets` are listed

2. **Test upload** (optional):
   - Use the course builder to upload a test video
   - Verify the file appears in the `course-videos` bucket

## Storage Structure

Files are organized in the following structure:

```
course-videos/
├── courses/
│   └── {courseId}/
│       └── modules/
│           └── {moduleId}/
│               └── chapters/
│                   └── {chapterId}/
│                       └── video_filename.mp4

course-assets/
├── courses/
│   └── {courseId}/
│       ├── assets/
│       │   └── thumbnail.jpg
│       └── thumbnails/
│           └── module_thumbnail.png
```

## Access Control

- **course-videos**: Private bucket, requires signed URLs
  - Enrolled students can view videos
  - Instructors can upload/manage videos
  - Admins have full access

- **course-assets**: Public bucket
  - Anyone can view assets
  - Only instructors/admins can upload/manage

## Environment Variables

Ensure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting

### Upload fails with "Bucket not found"
- Verify buckets are created in Supabase dashboard
- Check bucket names match exactly: `course-videos` and `course-assets`

### Upload fails with "Policy violation"
- Verify storage policies are applied (run migration SQL)
- Check user has proper permissions (instructor/admin role)

### Video URL returns 403
- Verify signed URL generation is working
- Check enrollment status for student access
- Verify chapter is marked as preview for public access

## Next Steps

1. ✅ Create storage buckets
2. ✅ Apply storage policies
3. ✅ Test video upload via course builder
4. ✅ Test video playback for enrolled students

