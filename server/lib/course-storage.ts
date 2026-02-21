import { supabaseRemote } from './supabase-remote';

export const STORAGE_BUCKETS = {
  COURSE_VIDEOS: 'course-videos',
  COURSE_ASSETS: 'course-assets',
} as const;

export interface UploadVideoOptions {
  file: File | Buffer;
  courseId: string;
  moduleId: string;
  chapterId: string;
  filename?: string;
  onProgress?: (progress: number) => void;
}

export interface UploadAssetOptions {
  file: File | Buffer;
  courseId: string;
  filename?: string;
  folder?: string;
}

export async function uploadCourseVideo(options: UploadVideoOptions): Promise<{
  url: string;
  path: string;
  size: number;
  isTemp?: boolean;
}> {
  const { file, courseId, moduleId, chapterId, filename } = options;

  const isTempUpload = chapterId === 'new' || chapterId.startsWith('temp-');

  const fileExtension = filename?.split('.').pop() || 'mp4';
  const timestamp = Date.now();
  const uniqueFilename = filename || `video_${timestamp}.${fileExtension}`;

  const filePath = isTempUpload
    ? `courses/${courseId}/modules/${moduleId}/temp/${chapterId}/${uniqueFilename}`
    : `courses/${courseId}/modules/${moduleId}/chapters/${chapterId}/${uniqueFilename}`;

  const buffer = file instanceof File
    ? await file.arrayBuffer().then(buf => Buffer.from(buf))
    : file;

  const { data, error } = await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .upload(filePath, buffer, {
      contentType: file instanceof File ? file.type : 'video/mp4',
      upsert: false,
      cacheControl: '3600',
    });

  if (error) {
    throw new Error(`Failed to upload video: ${error.message}`);
  }

  const { data: urlData } = supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .getPublicUrl(filePath);

  const listPath = isTempUpload
    ? `courses/${courseId}/modules/${moduleId}/temp/${chapterId}`
    : `courses/${courseId}/modules/${moduleId}/chapters/${chapterId}`;

  const { data: fileData } = await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .list(listPath, {
      limit: 1,
      search: uniqueFilename,
    });

  const size = fileData?.[0]?.metadata?.size || buffer.length;

  return {
    url: urlData.publicUrl,
    path: filePath,
    size,
    isTemp: isTempUpload,
  };
}

export async function getVideoSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string> {
  const { data, error } = await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }

  return data.signedUrl;
}

export async function uploadCourseAsset(options: UploadAssetOptions): Promise<{
  url: string;
  path: string;
  size: number;
}> {
  const { file, courseId, filename, folder = 'assets' } = options;

  const fileExtension = filename?.split('.').pop() || 'jpg';
  const timestamp = Date.now();
  const uniqueFilename = filename || `asset_${timestamp}.${fileExtension}`;

  const filePath = `courses/${courseId}/${folder}/${uniqueFilename}`;

  const buffer = file instanceof File
    ? await file.arrayBuffer().then(buf => Buffer.from(buf))
    : file;

  const { data, error } = await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_ASSETS)
    .upload(filePath, buffer, {
      contentType: file instanceof File ? file.type : 'image/jpeg',
      upsert: true,
      cacheControl: '86400',
    });

  if (error) {
    throw new Error(`Failed to upload asset: ${error.message}`);
  }

  const { data: urlData } = supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_ASSETS)
    .getPublicUrl(filePath);

  const size = buffer.length;

  return {
    url: urlData.publicUrl,
    path: filePath,
    size,
  };
}

export async function deleteCourseVideo(filePath: string): Promise<void> {
  const { error } = await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete video: ${error.message}`);
  }
}

export async function deleteCourseAsset(filePath: string): Promise<void> {
  const { error } = await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_ASSETS)
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete asset: ${error.message}`);
  }
}

export async function moveVideoFromTemp(
  tempPath: string,
  courseId: string,
  moduleId: string,
  chapterId: string
): Promise<{
  url: string;
  path: string;
}> {
  const filename = tempPath.split('/').pop();
  if (!filename) {
    throw new Error('Invalid temp path: filename not found');
  }

  const finalPath = `courses/${courseId}/modules/${moduleId}/chapters/${chapterId}/${filename}`;

  const { data: fileData, error: downloadError } = await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .download(tempPath);

  if (downloadError || !fileData) {
    throw new Error(`Failed to download temp video: ${downloadError?.message || 'Unknown error'}`);
  }

  const arrayBuffer = await fileData.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .upload(finalPath, buffer, {
      contentType: 'video/mp4',
      upsert: false,
      cacheControl: '3600',
    });

  if (uploadError) {
    throw new Error(`Failed to upload video to final location: ${uploadError.message}`);
  }

  await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .remove([tempPath])
    .catch((err) => {
      console.warn('Failed to delete temp file (non-critical):', err);
    });

  const { data: urlData } = supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .getPublicUrl(finalPath);

  return {
    url: urlData.publicUrl,
    path: finalPath,
  };
}

export async function listChapterVideos(
  courseId: string,
  moduleId: string,
  chapterId: string
): Promise<string[]> {
  const folderPath = `courses/${courseId}/modules/${moduleId}/chapters/${chapterId}`;

  const { data, error } = await supabaseRemote.storage
    .from(STORAGE_BUCKETS.COURSE_VIDEOS)
    .list(folderPath);

  if (error) {
    throw new Error(`Failed to list videos: ${error.message}`);
  }

  return data?.map(file => `${folderPath}/${file.name}`) || [];
}
