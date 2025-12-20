// Onboarding System Types
// Types for onboarding modules, videos, and progress tracking

export interface OnboardingModule {
  id: string
  title: string
  description: string | null
  order_index: number
  thumbnail: string | null
  created_at: string
  updated_at: string
  videos?: OnboardingVideo[]
}

export interface OnboardingVideo {
  id: string
  module_id: string
  title: string
  description: string | null
  video_url: string | null
  video_storage_path: string | null
  video_source?: 'upload' | 'embed' // 'upload' for Supabase Storage, 'embed' for external URLs like YouTube
  video_duration: number | null // Duration in seconds
  thumbnail: string | null
  order_index: number
  created_at: string
  updated_at: string
  module?: OnboardingModule
}

export interface OnboardingProgress {
  id: string
  user_id: string
  video_id: string
  module_id: string | null
  completed: boolean
  completed_at: string | null
  watch_duration: number // Total seconds watched
  last_position: number // Last position in seconds (for resume)
  created_at: string
  updated_at: string
  video?: OnboardingVideo
}

export interface OnboardingStatus {
  onboarding_completed: boolean
  onboarding_completed_at: string | null
  onboarding_progress: number // 0-100
  completed_videos: number
  total_videos: number
  completed_modules: number
  total_modules: number
}

export interface OnboardingCourseResponse {
  modules: OnboardingModule[]
  total_videos: number
  total_modules: number
}

export interface OnboardingProgressResponse {
  progress: OnboardingProgress[]
  status: OnboardingStatus
}

export interface UpdateProgressRequest {
  video_id: string
  watch_duration?: number
  last_position?: number
  completed?: boolean
}

export interface CompleteVideoRequest {
  video_id: string
  watch_duration: number
}

