// Transform API Course type to Admin Course format
import { Course as APICourse, CourseModule, CourseChapter } from "@/types/courses"
import { Course, Module, Chapter } from "../data/courses"

// Format duration_minutes to "X hours" string format
function formatDuration(minutes: number | null): string | undefined {
  if (!minutes) return undefined
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins} min`
  if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  return `${hours}h ${mins}m`
}

// Transform API CourseModule to Admin Module
function transformModule(apiModule: CourseModule, chapters?: CourseChapter[]): Module {
  return {
    id: apiModule.id,
    course_id: apiModule.course_id,
    title: apiModule.title,
    description: apiModule.description || undefined,
    thumbnail: apiModule.thumbnail || undefined,
    order_index: apiModule.order_index,
    duration: formatDuration(apiModule.duration_minutes),
    is_preview: apiModule.is_preview || false,
    created_at: apiModule.created_at,
    updated_at: apiModule.updated_at,
    chapters: chapters?.map(transformChapter) || [],
  }
}

// Transform API CourseChapter to Admin Chapter
function transformChapter(apiChapter: CourseChapter): Chapter {
  return {
    id: apiChapter.id,
    module_id: apiChapter.module_id,
    title: apiChapter.title,
    description: apiChapter.description || undefined,
    content_type: apiChapter.content_type,
    content: apiChapter.content,
    order_index: apiChapter.order_index,
    duration: formatDuration(apiChapter.duration_minutes),
    is_preview: apiChapter.is_preview || false,
    created_at: apiChapter.created_at,
    updated_at: apiChapter.updated_at,
    resources: apiChapter.resources?.map(r => ({
      id: r.id,
      name: r.name,
      url: r.url,
      type: r.type || "",
      size: r.size || undefined,
    })) || [],
  }
}

// Transform API Course to Admin Course format
export function transformAPICourseToAdmin(apiCourse: APICourse): Course {
  return {
    id: apiCourse.id,
    title: apiCourse.title,
    slug: apiCourse.slug,
    description: apiCourse.description || "",
    instructor_id: apiCourse.instructor_id,
    instructor_name: apiCourse.instructor_name || "",
    instructor_avatar: apiCourse.instructor_avatar ?? null,
    thumbnail: apiCourse.thumbnail,
    duration: formatDuration(apiCourse.duration_minutes) ?? null,
    lessons_count: apiCourse.lessons_count,
    students_count: apiCourse.students_count,
    rating: apiCourse.rating,
    price: apiCourse.price,
    category: apiCourse.category,
    level: apiCourse.level,
    featured: apiCourse.featured,
    published: apiCourse.published,
    published_at: apiCourse.published_at,
    modules: apiCourse.modules?.map((module) => 
      transformModule(module, module.chapters)
    ),
    tags: apiCourse.tags || [],
    learning_objectives: apiCourse.learning_objectives || [],
    prerequisites: apiCourse.prerequisites || [],
    created_at: apiCourse.created_at,
    updated_at: apiCourse.updated_at,
  }
}

