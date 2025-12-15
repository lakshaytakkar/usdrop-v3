// Helper functions for API operations in course builder
import { Course as AdminCourse, Module, Chapter } from "../data/courses"
import { Course as APICourse } from "@/types/courses"
import { transformAPICourseToAdmin } from "./transform"

// Parse duration string like "8 hours", "2h 30m", "15:30" to minutes
export function parseDurationToMinutes(duration: string | null | undefined): number | null {
  if (!duration) return null
  
  // Handle "HH:MM" format
  const timeMatch = duration.match(/^(\d+):(\d+)$/)
  if (timeMatch) {
    const hours = parseInt(timeMatch[1], 10)
    const minutes = parseInt(timeMatch[2], 10)
    return hours * 60 + minutes
  }
  
  // Handle "Xh Ym" or "X hours Y minutes" format
  let totalMinutes = 0
  const hourMatch = duration.match(/(\d+)\s*h(?:ours?)?/i)
  if (hourMatch) {
    totalMinutes += parseInt(hourMatch[1], 10) * 60
  }
  
  const minuteMatch = duration.match(/(\d+)\s*m(?:in(?:utes?)?)?/i)
  if (minuteMatch) {
    totalMinutes += parseInt(minuteMatch[1], 10)
  }
  
  return totalMinutes || null
}

// Transform Admin Course to API format for saving
export function transformAdminCourseToAPI(course: AdminCourse): Partial<APICourse> {
  return {
    title: course.title,
    slug: course.slug,
    description: course.description || null,
    instructor_id: course.instructor_id,
    thumbnail: course.thumbnail,
    category: course.category,
    level: course.level,
    price: course.price,
    featured: course.featured,
    published: course.published,
    tags: course.tags || [],
    learning_objectives: course.learning_objectives || [],
    prerequisites: course.prerequisites || [],
  }
}

// Transform Admin Module to API format
export function transformAdminModuleToAPI(module: Module): any {
  return {
    title: module.title,
    description: module.description || null,
    thumbnail: module.thumbnail || null,
    order_index: module.order_index,
    duration_minutes: parseDurationToMinutes(module.duration || null),
    is_preview: module.is_preview || false,
  }
}

// Transform Admin Chapter to API format
export function transformAdminChapterToAPI(chapter: Chapter): any {
  const durationMinutes = parseDurationToMinutes(chapter.duration || null)
  
  // Handle video duration from content if available
  let finalDurationMinutes = durationMinutes
  if (!finalDurationMinutes && chapter.content?.video_duration) {
    finalDurationMinutes = parseDurationToMinutes(chapter.content.video_duration)
  }
  
  return {
    title: chapter.title,
    description: chapter.description || null,
    content_type: chapter.content_type,
    content: chapter.content,
    order_index: chapter.order_index,
    duration_minutes: finalDurationMinutes,
    is_preview: chapter.is_preview || false,
  }
}

// Fetch course from API
export async function fetchCourseFromAPI(courseId: string): Promise<AdminCourse> {
  const response = await fetch(`/api/admin/courses/${courseId}`)
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to fetch course')
  }
  
  const data = await response.json()
  return transformAPICourseToAdmin(data.course)
}

// Save course via API
export async function saveCourseToAPI(courseId: string, course: AdminCourse): Promise<AdminCourse> {
  const isNew = courseId === "new"
  const apiData = transformAdminCourseToAPI(course)
  
  if (isNew) {
    // Create new course
    const response = await fetch('/api/admin/courses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...apiData,
        slug: course.slug || course.title.toLowerCase().replace(/\s+/g, '-'),
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create course')
    }
    
    const data = await response.json()
    return transformAPICourseToAdmin(data.course)
  } else {
    // Update existing course
    const response = await fetch(`/api/admin/courses/${courseId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update course')
    }
    
    const data = await response.json()
    return transformAPICourseToAdmin(data.course)
  }
}

// Save module via API
export async function saveModuleToAPI(courseId: string, module: Module, isNew: boolean): Promise<Module> {
  const apiData = transformAdminModuleToAPI(module)
  
  if (isNew) {
    const response = await fetch(`/api/admin/courses/${courseId}/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create module')
    }
    
    const data = await response.json()
    // Refetch course to get updated module with proper ID
    const course = await fetchCourseFromAPI(courseId)
    return course.modules?.find(m => m.title === data.module.title) || module
  } else {
    const response = await fetch(`/api/admin/courses/${courseId}/modules/${module.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update module')
    }
    
    return module
  }
}

// Delete module via API
export async function deleteModuleFromAPI(courseId: string, moduleId: string): Promise<void> {
  const response = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to delete module')
  }
}

// Save chapter via API
export async function saveChapterToAPI(
  courseId: string, 
  moduleId: string, 
  chapter: Chapter, 
  isNew: boolean
): Promise<Chapter> {
  const apiData = transformAdminChapterToAPI(chapter)
  
  if (isNew) {
    const response = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/chapters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create chapter')
    }
    
    // Refetch course to get updated chapter with proper ID
    const course = await fetchCourseFromAPI(courseId)
    const module = course.modules?.find(m => m.id === moduleId)
    return module?.chapters?.find(ch => ch.title === chapter.title) || chapter
  } else {
    const response = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/chapters/${chapter.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiData),
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to update chapter')
    }
    
    return chapter
  }
}

// Delete chapter via API
export async function deleteChapterFromAPI(courseId: string, moduleId: string, chapterId: string): Promise<void> {
  const response = await fetch(`/api/admin/courses/${courseId}/modules/${moduleId}/chapters/${chapterId}`, {
    method: 'DELETE',
  })
  
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || 'Failed to delete chapter')
  }
}

