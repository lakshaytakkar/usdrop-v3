export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  thumbnail: string
  duration: string
  lessons: number
  students: number
  rating: number
  price: number
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  featured: boolean
  tags: string[]
  modules: CourseModule[]
}

export interface CourseModule {
  id: string
  title: string
  duration: string
  lessons: number
  completed: boolean
  description?: string
  thumbnail?: string
  video_url?: string
}

/**
 * @deprecated This static data array is deprecated.
 * All course data is now fetched from the database via API routes.
 * See: /api/courses and /api/admin/courses
 * 
 * This file is kept only for TypeScript type definitions.
 * The sampleCourses array has been removed - use API calls instead.
 */
export const sampleCourses: Course[] = []
