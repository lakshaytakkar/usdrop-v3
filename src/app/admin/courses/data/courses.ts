// Chapter Content Types
export type ChapterContentType = "video" | "text" | "quiz" | "assignment" | "resource"

// Quiz Question Types
export interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "true-false" | "short-answer"
  options?: string[]
  correct_answer: string | number
  explanation?: string
  points: number
}

// Chapter Content based on type
export interface ChapterContent {
  video_url?: string
  video_storage_path?: string
  video_transcript?: string
  video_duration?: string
  text_content?: string
  quiz_questions?: QuizQuestion[]
  assignment_instructions?: string
  assignment_type?: "file-upload" | "text-submission" | "both"
  downloadable_files?: string[]
  resource_url?: string
  resource_type?: "pdf" | "image" | "document" | "link"
}

// Resource interface
export interface Resource {
  id: string
  name: string
  url: string
  type: string
  size?: string
}

// Chapter interface
export interface Chapter {
  id: string
  module_id: string
  title: string
  description?: string
  content_type: ChapterContentType
  content: ChapterContent
  order_index: number
  duration?: string
  is_preview?: boolean
  resources?: Resource[]
  created_at: string
  updated_at: string
}

// Module interface
export interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  thumbnail?: string
  order_index: number
  chapters?: Chapter[]
  duration?: string
  is_preview?: boolean
  created_at: string
  updated_at: string
}

// Course interface - enhanced with modules
export interface Course {
  id: string
  title: string
  slug: string
  description: string
  instructor_id: string | null
  instructor_name: string
  instructor_avatar: string | null
  thumbnail: string | null
  duration: string | null
  lessons_count: number
  students_count: number
  rating: number | null
  price: number
  category: string | null
  level: "Beginner" | "Intermediate" | "Advanced" | null
  featured: boolean
  published: boolean
  published_at: string | null
  modules?: Module[]
  tags?: string[]
  learning_objectives?: string[]
  prerequisites?: string[]
  created_at: string
  updated_at: string
}

/**
 * @deprecated This static data array is deprecated.
 * All course data is now fetched from the database via API routes.
 * See: /api/admin/courses
 * 
 * This file is kept only for TypeScript type definitions.
 * The sampleCourses array has been removed - use API calls instead.
 */
export const sampleCourses: Course[] = []
