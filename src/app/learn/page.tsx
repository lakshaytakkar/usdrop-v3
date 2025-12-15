"use client"

import { Header } from '@/components/landing-deprecated/Header';
import { Footer } from '@/components/landing-deprecated/Footer';
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { 
  Star, 
  Clock, 
  Book, 
  Play, 
  ArrowRight,
  Video,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Award
} from "lucide-react"
import { Course } from "@/app/academy/data/courses"
import { Course as APICourse } from "@/types/courses"
import { sampleWebinars } from "@/app/webinars/data/webinars"
import { MentorBadge } from "@/components/academy/mentor-badge"
import { MentorFeatures } from "@/components/academy/mentor-features"
import { MentorStats } from "@/components/academy/mentor-stats"
import { MentorVisualCard } from "@/components/academy/mentor-visual-card"

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

const upcomingWebinars = sampleWebinars.filter(w => w.isUpcoming).slice(0, 2)
const recentWebinars = sampleWebinars.filter(w => !w.isUpcoming).slice(0, 2)
const displayWebinars = upcomingWebinars.length > 0 ? upcomingWebinars : recentWebinars

interface CoursePreviewCardProps {
  course: Course
}

function CoursePreviewCard({ course }: CoursePreviewCardProps) {
  return (
    <Link 
      href="/academy"
      className="group relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition-all hover:border-blue-500 hover:shadow-xl"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h4>
          <Badge variant="outline" className="shrink-0 text-xs">
            {course.level}
          </Badge>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2">
          {course.description}
        </p>
        <div className="flex items-center gap-3 text-xs text-slate-500">
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
          className="mt-2 w-full bg-blue-600 text-white hover:bg-blue-700"
          onClick={(e) => e.stopPropagation()}
        >
          <Play className="h-3 w-3 mr-2" />
          Start Learning
        </Button>
      </div>
    </Link>
  )
}

export default function LearnPage() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [loading, setLoading] = useState(true)
  // Unused state variables - kept to avoid breaking existing code
  const [, setAllCourses] = useState<Course[]>([])
  const [, setGettingStartedCourse] = useState<Course | null>(null)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        
        // Fetch all published courses
        const responseAll = await fetch('/api/courses?published=true')
        if (responseAll.ok) {
          const allData = await responseAll.json()
          const allCoursesData = (allData.courses || []).map(transformCourse)
          setAllCourses(allCoursesData)
          
          // Calculate total students
          const total = allCoursesData.reduce((acc: number, c: Course) => acc + (c.students || 0), 0)
          setTotalStudents(total)
          
          // Find "Getting Started" course by searching title
          const gettingStarted = allCoursesData.find((course: Course) => 
            course.title.toLowerCase().includes('getting started') ||
            course.title.toLowerCase().includes('getting-started')
          )
          
          if (gettingStarted) {
            setGettingStartedCourse(gettingStarted)
            // Filter out getting started from featured courses
            const otherCourses = allCoursesData
              .filter((c: Course) => c.id !== gettingStarted.id)
              .filter((c: Course) => c.featured)
              .slice(0, 3)
            setFeaturedCourses(otherCourses)
          } else {
            // If no getting started course found, use featured courses
            const featured = allCoursesData
              .filter((c: Course) => c.featured)
              .slice(0, 3)
            setFeaturedCourses(featured)
          }
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Hero Area - Reused Mentor Section */}
          <div className="mb-16">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                USDrop Academy & Live Webinars
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Join thousands of successful entrepreneurs. Learn from 14+ years of experience through structured courses and live interactive sessions.
              </p>
            </div>

            <Card className="border-slate-200 bg-white shadow-sm p-6 md:p-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
              
              <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8 relative z-10">
                {/* Left Column - Content */}
                <div className="flex flex-col gap-4">
                  <MentorBadge />
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight mb-1">
                      Learn from the Best
                    </h2>
                    <h3 className="text-xl md:text-2xl font-bold text-blue-600 leading-tight">
                      Mr. Suprans & Industry Experts
                    </h3>
                  </div>
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                    Don&apos;t just learn the theory. Learn the battle-tested strategies from <strong className="font-semibold text-slate-900">Mr. Suprans</strong>, who has scaled multiple 7-figure stores and mentored over 25k+ students. Avoid the pitfalls and fast-track your success.
                  </p>
                  <MentorFeatures />
                  <div className="flex flex-wrap gap-4">
                    <Link href="/academy">
                      <Button 
                        size="lg" 
                        className="bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all font-semibold"
                      >
                        Join the Academy
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/webinars">
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold"
                      >
                        <Video className="h-4 w-4 mr-2" />
                        See Upcoming Webinars
                      </Button>
                    </Link>
                  </div>
                  <MentorStats />
                </div>

                {/* Right Column - Visual Card */}
                <div className="flex items-center justify-center lg:justify-end">
                  <MentorVisualCard />
                </div>
              </div>
            </Card>
          </div>

          {/* Webinars Strip */}
          <div className="mb-16">
             <div className="flex items-center justify-between mb-6">
               <div>
                 <h2 className="text-2xl font-bold text-slate-900">Live Webinars & Events</h2>
                 <p className="text-sm text-slate-600">Interactive sessions to keep you ahead of the curve</p>
               </div>
               <Link href="/webinars">
                 <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                   View Schedule <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
               </Link>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {displayWebinars.map((webinar) => (
                 <div key={webinar.id} className="flex flex-col p-6 rounded-xl border border-slate-200 bg-slate-50 hover:border-blue-300 transition-colors">
                   <div className="flex items-start justify-between mb-4">
                     <Badge className={`${webinar.isUpcoming ? 'bg-green-600' : 'bg-slate-600'} text-white border-none`}>
                       {webinar.isUpcoming ? 'Upcoming Live' : 'Available Recording'}
                     </Badge>
                     <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                       <Calendar className="h-3 w-3" />
                       {webinar.date.toLocaleDateString()}
                     </span>
                   </div>
                   <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                     {webinar.title.split(':')[0]}
                   </h3>
                   <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                     {webinar.description}
                   </p>
                   <Link href="/webinars" className="mt-auto">
                     <Button variant="outline" size="sm" className="w-full bg-white hover:bg-slate-50">
                       {webinar.isUpcoming ? 'Register Now' : 'Watch Recording'}
                     </Button>
                   </Link>
                 </div>
               ))}
             </div>
          </div>

          {/* Learning Paths */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Your Path to Success</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" /> Beginner
                </h3>
                <p className="text-sm text-slate-600 mb-4">Start here if you&apos;ve never sold online before.</p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• Setting up your store</li>
                  <li>• Finding your first product</li>
                  <li>• Understanding fulfillment</li>
                </ul>
                <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold">Start Beginner Path →</Button>
              </div>
              
              <div className="p-6 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" /> Intermediate
                </h3>
                <p className="text-sm text-slate-600 mb-4">Scale your first winners and optimize ads.</p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• Facebook Ads Mastery</li>
                  <li>• Creative testing strategies</li>
                  <li>• Increasing AOV</li>
                </ul>
                <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold">Start Intermediate Path →</Button>
              </div>
              
              <div className="p-6 rounded-xl border border-slate-200 bg-white hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" /> Advanced
                </h3>
                <p className="text-sm text-slate-600 mb-4">Build a brand and automate operations.</p>
                <ul className="text-sm text-slate-500 space-y-2 mb-6">
                  <li>• Private labeling</li>
                  <li>• Team building & SOPs</li>
                  <li>• Multi-channel expansion</li>
                </ul>
                <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold">Start Advanced Path →</Button>
              </div>
            </div>
          </div>

          {/* Course Preview Section */}
          <div className="mb-16">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Featured Courses</h2>
                <p className="text-sm text-slate-600 mt-1">Comprehensive video guides for every stage</p>
              </div>
              <Link href="/academy">
                <Button variant="ghost" className="text-blue-600 hover:bg-blue-50">
                  View All Courses <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-8 text-slate-600">Loading courses...</div>
              ) : featuredCourses.length > 0 ? (
                featuredCourses.map((course) => (
                  <CoursePreviewCard key={course.id} course={course} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-slate-600">No courses available yet.</div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-xl border border-blue-200 bg-blue-50/50 p-8 text-center sm:text-left">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">Ready to start learning?</h3>
              <p className="text-slate-600">Join {numberFormatter.format(totalStudents)} students in the USDrop Academy today.</p>
            </div>
            <div className="flex gap-4">
               <Link href="/#trial">
                 <Button size="lg" className="bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                   Get Free Access
                 </Button>
               </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
