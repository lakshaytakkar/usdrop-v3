


import { apiFetch } from '@/lib/supabase'
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { 
  GraduationCap, 
  Star, 
  Clock, 
  Book, 
  Users, 
  Play, 
  ArrowRight,
  Award,
  TrendingUp,
  CheckCircle2
} from "lucide-react"
import { Course } from "@/pages/mentorship/data/courses"
import { Course as APICourse } from "@/types/courses"
import { cn } from "@/lib/utils"

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

// Transform API Course to legacy Course format
function transformCourse(apiCourse: APICourse): Course {
  const formatDuration = (minutes: number | null): string => {
    if (!minutes) return "0 hours"
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours === 0) return `${mins} min`
    if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return `${hours}h ${mins}m`
  }

  return {
    id: apiCourse.id,
    title: apiCourse.title,
    description: apiCourse.description || "",
    instructor: apiCourse.instructor_name || "Instructor",
    instructorAvatar: apiCourse.instructor_avatar || "/images/default-avatar.png",
    thumbnail: apiCourse.thumbnail || "/images/default-course.png",
    duration: formatDuration(apiCourse.duration_minutes),
    lessons: apiCourse.lessons_count,
    students: apiCourse.students_count,
    rating: apiCourse.rating || 0,
    price: apiCourse.price,
    category: apiCourse.category || "",
    level: apiCourse.level || "Beginner",
    featured: apiCourse.featured,
    tags: apiCourse.tags || [],
    modules: apiCourse.modules?.map((module) => ({
      id: module.id,
      title: module.title,
      duration: module.duration_minutes
        ? `${Math.floor(module.duration_minutes / 60)}h ${module.duration_minutes % 60}m`
        : "0 min",
      lessons: module.chapters?.length || 0,
      completed: false,
      description: module.description || undefined,
      thumbnail: module.thumbnail || undefined,
    })) || [],
  }
}

interface CoursePreviewCardProps {
  course: Course
}

function CoursePreviewCard({ course }: CoursePreviewCardProps) {
  return (
    <Link 
      href="/mentorship"
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/50"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={course.thumbnail}
          alt={course.title}
         
          className="object-cover"
         
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h4>
          <Badge variant="outline" className="shrink-0 text-xs">
            {course.level}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Book className="h-3 w-3" />
            <span>{course.lessons}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
          </div>
        </div>
        <Button 
          size="sm" 
          className="mt-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={(e) => e.stopPropagation()}
        >
          <Play className="h-3 w-3" />
          Start Learning
        </Button>
      </div>
    </Link>
  )
}

export function AcademyMarketingDropdown() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalCourses, setTotalCourses] = useState(0)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiFetch("/api/courses?published=true&pageSize=3")
        if (response.ok) {
          const data = await response.json()
          const courses = (data.courses || []).slice(0, 3).map(transformCourse)
          setFeaturedCourses(courses)
        }
        
        // Fetch total stats
        const responseAll = await apiFetch("/api/courses?published=true")
        if (responseAll.ok) {
          const allData = await responseAll.json()
          const allCourses = allData.courses || []
          const total = allCourses.reduce((acc: number, c: APICourse) => acc + (c.students_count || 0), 0)
          setTotalStudents(total)
          setTotalCourses(allCourses.length)
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="w-[900px] max-w-[calc(100vw-2rem)] p-6">
      {/* About the Mentor Section */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">About the Mentor</h3>
            <p className="text-sm text-muted-foreground">Learn from industry expertise</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 rounded-xl border border-border bg-gradient-to-br from-card to-card/50 p-6 shadow-sm">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-lg">
              <AvatarImage src="/images/suprans profile.jpg" alt="Mr. Suprans" />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                MS
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary shadow-lg">
              <Award className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <h4 className="text-xl font-bold text-foreground">Mr. Suprans</h4>
              <p className="text-sm font-semibold text-primary">14+ Years of Dropshipping Excellence</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Built and scaled multiple 7-figure dropshipping businesses from the ground up
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Expert in product research, Facebook ads optimization, and store conversion strategies
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Mentored thousands of entrepreneurs to achieve their e-commerce goals
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Deep expertise in USDrop platform tools and advanced automation strategies
                </p>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-1.5 border border-primary/20">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {numberFormatter.format(totalStudents)} Students
                </span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-1.5 border border-primary/20">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  {totalCourses} Comprehensive Courses
                </span>
              </div>
            </div>

            <Link href="/mentorship">
              <Button className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90">
                Learn More About the Mentor
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Course Preview Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Featured Courses</h3>
            <p className="text-sm text-muted-foreground">Start your dropshipping journey today</p>
          </div>
          <Link href="/mentorship">
            <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
              View All Courses
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <CoursePreviewCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-4 text-muted-foreground text-sm">Loading courses...</div>
          )}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/15 dark:to-primary/10 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 dark:bg-primary/30 border border-primary/30">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Join {numberFormatter.format(totalStudents)} students
              </p>
              <p className="text-xs text-muted-foreground">Already learning with USDrop Academy</p>
            </div>
          </div>
          <Link href="/mentorship" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow">
              Explore Academy
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

