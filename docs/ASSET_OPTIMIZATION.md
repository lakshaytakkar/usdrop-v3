# Asset Optimization Guide

This guide explains how to optimize static assets (images, icons, etc.) for better performance after deployment.

## Problem

After deployment, static assets can load slowly because:
1. They're served directly from the Next.js server (no CDN)
2. No image optimization is applied
3. Using `<img>` tags instead of Next.js `<Image>` component
4. Large file sizes without compression

## Solution: Supabase Storage + Next.js Image Optimization

We've implemented a two-part solution:

### 1. Next.js Image Component (Immediate Fix)

✅ **Already implemented** - Replaced `<img>` tags with Next.js `<Image>` component which provides:
- Automatic image optimization (WebP/AVIF conversion)
- Lazy loading
- Responsive images
- Better caching

### 2. Supabase Storage CDN (Recommended for Production)

Upload static assets to Supabase Storage for:
- **CDN delivery** - Assets served from edge locations worldwide
- **Faster loading** - Reduced latency for users
- **Better caching** - Browser and CDN caching
- **Scalability** - No impact on your Next.js server

## Setup Instructions

### Step 1: Create Supabase Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** → **Buckets**
3. Click **New Bucket**
4. Name: `static-assets`
5. **Make it Public** (important for CDN access)
6. Set file size limit: 50MB
7. Allowed MIME types: `image/*`, `application/json`

### Step 2: Run Migration Script

```bash
# Make sure you have SUPABASE_SERVICE_ROLE_KEY in your .env.local
npx tsx scripts/migrate-assets-to-supabase.ts
```

This will:
- Create the bucket if it doesn't exist
- Upload all assets from `public/christmas-icons`, `public/3d-icons`, etc.
- Organize them in storage: `icons/christmas/`, `icons/3d/`, etc.

### Step 3: Enable Supabase Storage in Your App

Add to your `.env.local`:

```env
NEXT_PUBLIC_USE_SUPABASE_STORAGE=true
```

### Step 4: Update Components (Optional)

If you want to use storage URLs, update components to use the helper:

```tsx
import { getAssetUrl } from '@/lib/utils/storage-url'
import Image from 'next/image'

// Instead of:
<Image src="/christmas-icons/Object 01.png" ... />

// Use:
<Image src={getAssetUrl('/christmas-icons/Object 01.png')} ... />
```

**Note:** The migration script is optional. The Next.js Image optimization alone will significantly improve performance.

## What's Already Fixed

✅ Replaced `<img>` tags with Next.js `<Image>` in:
- `src/components/feedback/banners/banner-carousel.tsx`
- `src/app/categories/page.tsx`

✅ Updated `next.config.ts` with:
- Image optimization (AVIF/WebP formats)
- Responsive image sizes
- Supabase Storage CDN pattern

## Performance Improvements

### Before:
- Images served from Next.js server
- No optimization
- No lazy loading
- Large file sizes

### After (with Next.js Image):
- Automatic format conversion (WebP/AVIF)
- Lazy loading
- Responsive images
- Better caching

### After (with Supabase Storage):
- CDN delivery (global edge locations)
- Even faster loading
- Reduced server load
- Better scalability

## Monitoring

Check your Supabase Storage dashboard to monitor:
- Storage usage
- Bandwidth usage
- File access patterns

## Troubleshooting

### Images not loading from Supabase Storage

1. Check bucket is **public**
2. Verify `NEXT_PUBLIC_USE_SUPABASE_STORAGE=true` is set
3. Check Supabase Storage URL pattern in `next.config.ts`
4. Verify files were uploaded (check Supabase dashboard)

### Migration script fails

1. Ensure `SUPABASE_SERVICE_ROLE_KEY` is in `.env.local`
2. Check bucket permissions
3. Verify file paths are correct

## Alternative: Keep Using Public Folder

If you prefer to keep assets in the public folder:
- Next.js Image optimization will still work
- No CDN benefits, but still much faster than before
- Simpler setup (no migration needed)

The choice is yours - both approaches work, but Supabase Storage provides better performance for production.



