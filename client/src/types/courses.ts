// Unified Course Types
// Replaces static course data types from academy and admin pages

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced'
export type ChapterContentType = 'video' | 'text' | 'quiz' | 'assignment' | 'resource'
export type QuizQuestionType = 'multiple-choice' | 'true-false' | 'short-answer'

// Quiz Question interface
export interface QuizQuestion {
  id: string
  question: string
  type: QuizQuestionType
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
  assignment_type?: 'file-upload' | 'text-submission' | 'both'
  downloadable_files?: string[]
  resource_url?: string
  resource_type?: 'pdf' | 'image' | 'document' | 'link'
}

// Course Resource interface
export interface CourseResource {
  id: string
  chapter_id: string
  name: string
  url: string
  type: string | null
  size: string | null
  created_at: string
}

// Course Chapter interface
export interface CourseChapter {
  id: string
  module_id: string
  title: string
  description: string | null
  content_type: ChapterContentType
  content: ChapterContent
  order_index: number
  duration_minutes: number | null
  is_preview: boolean
  created_at: string
  updated_at: string
  resources?: CourseResource[]
}

// Course Module interface
// Modules can now contain content directly (for simplified 2-level structure)
// or have nested chapters (for backward compatibility)
export interface CourseModule {
  id: string
  course_id: string
  title: string
  description: string | null
  thumbnail: string | null
  order_index: number
  duration_minutes: number | null
  is_preview: boolean
  created_at: string
  updated_at: string
  // Direct content fields (for 2-level Course → Module structure)
  content_type?: ChapterContentType
  content?: ChapterContent
  video_url?: string
  video_storage_path?: string
  video_duration?: number // Duration in seconds
  // Nested chapters (for 3-level Course → Module → Chapter structure)
  chapters?: CourseChapter[]
}

// Course interface - Main unified type
export interface Course {
  id: string
  title: string
  slug: string
  description: string | null
  instructor_id: string | null
  thumbnail: string | null
  duration_minutes: number | null
  lessons_count: number
  students_count: number
  rating: number | null
  price: number
  category: string | null
  level: CourseLevel | null
  featured: boolean
  published: boolean
  published_at: string | null
  tags: string[]
  learning_objectives: string[]
  prerequisites: string[]
  created_at: string
  updated_at: string
  modules?: CourseModule[]

  // Special flags
  is_onboarding?: boolean // Whether this is the mandatory onboarding course

  // Joined/Computed fields
  instructor_name?: string
  instructor_avatar?: string | null
}

// Course Enrollment interface
export interface CourseEnrollment {
  id: string
  course_id: string
  user_id: string
  enrolled_at: string
  completed_at: string | null
  progress_percentage: number
  last_accessed_at: string | null
  last_accessed_chapter_id: string | null
  course?: Course
}

// Chapter Completion interface
export interface ChapterCompletion {
  id: string
  enrollment_id: string
  chapter_id: string
  completed_at: string
  time_spent_minutes: number | null
  enrollment?: CourseEnrollment
  chapter?: CourseChapter
}

// Module Completion interface (for 2-level Course → Module structure)
export interface ModuleCompletion {
  id: string
  enrollment_id: string
  module_id: string
  completed_at: string
  time_spent_minutes: number | null
  watch_duration?: number // For video modules (in seconds)
  last_position?: number // For video resume (in seconds)
  enrollment?: CourseEnrollment
  module?: CourseModule
}

// Quiz Attempt interface
export interface QuizAttempt {
  id: string
  enrollment_id: string
  chapter_id: string
  answers: Record<string, any>
  score: number | null
  passed: boolean | null
  attempted_at: string
  completed_at: string | null
  enrollment?: CourseEnrollment
  chapter?: CourseChapter
}

// Course Certificate interface
export interface CourseCertificate {
  id: string
  enrollment_id: string
  certificate_number: string
  issued_at: string
  certificate_url: string | null
  enrollment?: CourseEnrollment
}

// Course Review interface
export interface CourseReview {
  id: string
  course_id: string
  user_id: string
  rating: number
  comment: string | null
  created_at: string
  updated_at: string
  course?: Course
  user_name?: string
  user_avatar?: string | null
}

// API Query Parameters for courses
export interface CourseQueryParams {
  category?: string
  level?: CourseLevel
  search?: string
  featured?: boolean
  published?: boolean
  sortBy?: 'created_at' | 'title' | 'rating' | 'students_count' | 'price'
  sortOrder?: 'asc' | 'desc'
  page?: number
  pageSize?: number
  instructor_id?: string
}

// API Response for course list
export interface CoursesResponse {
  courses: Course[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// API Response for single course with full structure
export interface CourseDetailResponse {
  course: Course & {
    modules: (CourseModule & {
      chapters: CourseChapter[]
    })[]
  }
  enrollment?: CourseEnrollment
  userProgress?: {
    completed_chapters: string[]
    progress_percentage: number
    last_accessed_chapter?: CourseChapter
  }
}

// Enrollment Progress Response
export interface EnrollmentProgressResponse {
  enrollment: CourseEnrollment
  completed_chapters: string[]
  total_chapters: number
  progress_percentage: number
  last_accessed_chapter?: CourseChapter
}

// Quiz Submission Request
export interface QuizSubmissionRequest {
  answers: Record<string, any>
}

// Quiz Submission Response
export interface QuizSubmissionResponse {
  attempt: QuizAttempt
  score: number
  passed: boolean
  feedback?: Record<string, {
    correct: boolean
    explanation?: string
  }>
}

// Certificate Response
export interface CertificateResponse {
  certificate: CourseCertificate
  course: Course
  enrollment: CourseEnrollment
}

