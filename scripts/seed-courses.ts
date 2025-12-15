/**
 * Seed script to migrate static course data to database
 * 
 * This script:
 * 1. Reads course data from static files (academy and admin)
 * 2. Merges and deduplicates courses
 * 3. Maps instructor names to internal users
 * 4. Inserts courses, modules, and chapters into the database
 */

import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://znddcikjgrvmltruuvca.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required')
  console.error('Please set it in your environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Parse duration string to minutes
function parseDurationToMinutes(duration: string | null | undefined): number | null {
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

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Find or create instructor user
async function findOrCreateInstructor(instructorName: string, instructorAvatar?: string | null): Promise<string | null> {
  if (!instructorName) return null
  
  // Try to find existing user by name
  const { data: existingUsers } = await supabase
    .from('profiles')
    .select('id, full_name, internal_role')
    .eq('full_name', instructorName)
    .eq('internal_role', 'admin') // Assuming instructors are admins
  
  if (existingUsers && existingUsers.length > 0) {
    return existingUsers[0].id
  }
  
  // If not found, return null (instructor_id will be null in the course)
  console.warn(`Instructor "${instructorName}" not found. Course will be created without instructor.`)
  return null
}

// Course data structure from static files
interface StaticCourse {
  id: string
  title: string
  description: string
  instructor?: string
  instructorAvatar?: string
  thumbnail: string
  duration: string
  lessons?: number
  students?: number
  rating?: number
  price: number
  category?: string
  level?: "Beginner" | "Intermediate" | "Advanced" | null
  featured?: boolean
  published?: boolean
  tags?: string[]
  modules?: StaticModule[]
}

interface StaticModule {
  id: string
  title: string
  duration?: string
  lessons?: number
  description?: string
  thumbnail?: string
  chapters?: StaticChapter[]
}

interface StaticChapter {
  id: string
  title: string
  description?: string
  content_type?: string
  content?: any
  duration?: string
}

async function seedCourses() {
  console.log('🌱 Starting course seeding...\n')

  try {
    // Import static course data
    // Note: In a real scenario, you'd import from the actual files
    // For now, we'll create a simplified version that you can update
    
    const coursesToSeed: StaticCourse[] = [
      {
        id: "course-001",
        title: "Dropshipping Fundamentals",
        description: "Master the fundamentals of dropshipping from business model basics to legal foundations. Perfect for complete beginners starting their e-commerce journey.",
        instructor: "Mr. Suprans",
        instructorAvatar: "/images/suprans profile.jpg",
        thumbnail: "/images/thumbnail-landscape-1764451401501.png",
        duration: "8 hours",
        lessons: 25,
        students: 5420,
        rating: 4.8,
        price: 0,
        category: "Basics",
        level: "Beginner",
        featured: false,
        tags: ["Dropshipping", "E-commerce", "Basics", "Business"],
        modules: [
          {
            id: "mod-1",
            title: "Introduction to Dropshipping Business Model",
            duration: "45 min",
            description: "Learn what dropshipping is, how it works, and why it's a viable business model.",
          },
        ],
      },
      // Add more courses here from your static data files
    ]

    console.log(`📚 Found ${coursesToSeed.length} courses to seed\n`)

    let successCount = 0
    let errorCount = 0

    for (const staticCourse of coursesToSeed) {
      try {
        console.log(`Processing: ${staticCourse.title}...`)

        // Generate slug
        const slug = generateSlug(staticCourse.title)

        // Check if course already exists
        const { data: existingCourse } = await supabase
          .from('courses')
          .select('id')
          .eq('slug', slug)
          .single()

        if (existingCourse) {
          console.log(`  ⏭️  Course already exists (slug: ${slug}), skipping...`)
          continue
        }

        // Find instructor
        const instructorId = staticCourse.instructor
          ? await findOrCreateInstructor(staticCourse.instructor, staticCourse.instructorAvatar)
          : null

        // Calculate duration in minutes
        const durationMinutes = parseDurationToMinutes(staticCourse.duration)

        // Count lessons from modules
        let lessonsCount = staticCourse.lessons || 0
        if (staticCourse.modules) {
          lessonsCount = staticCourse.modules.reduce((total, mod) => {
            return total + (mod.chapters?.length || mod.lessons || 0)
          }, 0)
        }

        // Create course
        const { data: course, error: courseError } = await supabase
          .from('courses')
          .insert({
            title: staticCourse.title,
            slug,
            description: staticCourse.description,
            instructor_id: instructorId,
            thumbnail: staticCourse.thumbnail || null,
            duration_minutes: durationMinutes,
            lessons_count: lessonsCount,
            students_count: staticCourse.students || 0,
            rating: staticCourse.rating || null,
            price: staticCourse.price || 0,
            category: staticCourse.category || null,
            level: staticCourse.level || null,
            featured: staticCourse.featured || false,
            published: staticCourse.published !== undefined ? staticCourse.published : true,
            published_at: staticCourse.published !== false ? new Date().toISOString() : null,
            tags: staticCourse.tags || [],
            learning_objectives: [],
            prerequisites: [],
          })
          .select()
          .single()

        if (courseError) {
          console.error(`  ❌ Error creating course: ${courseError.message}`)
          errorCount++
          continue
        }

        console.log(`  ✅ Course created: ${course.id}`)

        // Insert modules and chapters
        if (staticCourse.modules && staticCourse.modules.length > 0) {
          for (let moduleIndex = 0; moduleIndex < staticCourse.modules.length; moduleIndex++) {
            const staticModule = staticCourse.modules[moduleIndex]
            
            const moduleDurationMinutes = parseDurationToMinutes(staticModule.duration || null)
            const chapterCount = staticModule.chapters?.length || staticModule.lessons || 0

            const { data: module, error: moduleError } = await supabase
              .from('course_modules')
              .insert({
                course_id: course.id,
                title: staticModule.title,
                description: staticModule.description || null,
                thumbnail: staticModule.thumbnail || null,
                order_index: moduleIndex,
                duration_minutes: moduleDurationMinutes,
                is_preview: false,
              })
              .select()
              .single()

            if (moduleError) {
              console.error(`    ❌ Error creating module "${staticModule.title}": ${moduleError.message}`)
              continue
            }

            console.log(`    ✅ Module created: ${module.id}`)

            // Insert chapters if they exist
            if (staticModule.chapters && staticModule.chapters.length > 0) {
              for (let chapterIndex = 0; chapterIndex < staticModule.chapters.length; chapterIndex++) {
                const staticChapter = staticModule.chapters[chapterIndex]
                
                const chapterDurationMinutes = parseDurationToMinutes(staticChapter.duration || null)
                
                // Determine content type
                const contentType = staticChapter.content_type || 'video'
                
                // Build content object
                const content: any = staticChapter.content || {}
                if (contentType === 'video' && !content.video_url) {
                  content.video_url = null
                }

                const { error: chapterError } = await supabase
                  .from('course_chapters')
                  .insert({
                    module_id: module.id,
                    title: staticChapter.title,
                    description: staticChapter.description || null,
                    content_type: contentType,
                    content: content,
                    order_index: chapterIndex,
                    duration_minutes: chapterDurationMinutes,
                    is_preview: false,
                  })

                if (chapterError) {
                  console.error(`      ❌ Error creating chapter "${staticChapter.title}": ${chapterError.message}`)
                } else {
                  console.log(`      ✅ Chapter created: ${staticChapter.title}`)
                }
              }
            }
          }
        }

        successCount++
        console.log(`  ✨ Completed: ${staticCourse.title}\n`)
      } catch (err) {
        console.error(`  ❌ Error processing course "${staticCourse.title}":`, err)
        errorCount++
      }
    }

    console.log('\n📊 Seeding Summary:')
    console.log(`  ✅ Successfully seeded: ${successCount} courses`)
    console.log(`  ❌ Errors: ${errorCount} courses`)
    console.log('\n✨ Course seeding completed!')
  } catch (error) {
    console.error('❌ Fatal error during seeding:', error)
    process.exit(1)
  }
}

// Run the seeding
if (require.main === module) {
  seedCourses()
    .then(() => {
      console.log('\n✅ All done!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Seeding failed:', error)
      process.exit(1)
    })
}

export { seedCourses }

