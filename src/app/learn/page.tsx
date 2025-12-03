"use client"

import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { 
  Star, 
  Clock, 
  Book, 
  Users, 
  Play, 
  ArrowRight,
} from "lucide-react"
import { sampleCourses } from "@/app/academy/data/courses"
import { Course } from "@/app/academy/data/courses"
import { MentorBadge } from "@/components/academy/mentor-badge"
import { MentorFeatures } from "@/components/academy/mentor-features"
import { MentorStats } from "@/components/academy/mentor-stats"
import { MentorVisualCard } from "@/components/academy/mentor-visual-card"

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
})

// Get featured courses for preview (first 3 courses)
const featuredCourses = sampleCourses.slice(0, 3)

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
          <Play className="h-3 w-3" />
          Start Learning
        </Button>
      </div>
    </Link>
  )
}

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      
      <main className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* About the Mentor Section */}
          <div className="mb-10">
            <Card className="border-slate-200 bg-white shadow-sm p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8">
                {/* Left Column - Content */}
                <div className="flex flex-col gap-4">
                  {/* Mentor Badge */}
                  <MentorBadge />

                  {/* Main Heading */}
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-1">
                      Master Dropshipping
                    </h1>
                    <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600 leading-tight">
                      with 14+ Years Experience
                    </h2>
                  </div>

                  {/* Description */}
                  <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                    Don't just learn the theory. Learn the battle-tested strategies from <strong className="font-semibold text-slate-900">Mr. Suprans</strong>, who has scaled multiple 7-figure stores and mentored over 25k+ students. Avoid the pitfalls and fast-track your success.
                  </p>

                  {/* Features Grid */}
                  <MentorFeatures />

                  {/* CTA Button */}
                  <Link href="/academy">
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all font-semibold px-6 py-5"
                    >
                      Join the Academy
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>

                  {/* Social Proof Stats */}
                  <MentorStats />
                </div>

                {/* Right Column - Visual Card */}
                <div className="flex items-center justify-center lg:justify-end">
                  <MentorVisualCard />
                </div>
              </div>
            </Card>
          </div>

          {/* Course Preview Section */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">Featured Courses</h2>
                <p className="text-xs md:text-sm text-slate-600 mt-0.5">Start your dropshipping journey today</p>
              </div>
              <Link href="/academy">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                  View All Courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {featuredCourses.map((course) => (
                <CoursePreviewCard key={course.id} course={course} />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 border border-blue-700">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm md:text-base font-semibold text-slate-900">
                    Join {numberFormatter.format(sampleCourses.reduce((acc, c) => acc + c.students, 0))} students
                  </p>
                  <p className="text-xs md:text-sm text-slate-600">Already learning with USDrop Academy</p>
                </div>
              </div>
              <Link href="/academy" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-shadow">
                  Explore Academy
                  <ArrowRight className="h-4 w-4" />
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

