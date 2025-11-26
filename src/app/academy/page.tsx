"use client"

import { useState, useMemo } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Topbar } from "@/components/topbar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GraduationCap, Search, Presentation, Book } from "lucide-react"
import { CourseCard } from "./components/course-card"
import { Course, sampleCourses } from "./data/courses"

export default function AcademyPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedLevel, setSelectedLevel] = useState<string>("all")

  const categories = useMemo(() => {
    return ["all", ...Array.from(new Set(sampleCourses.map((c) => c.category)))]
  }, [])

  const levels = ["all", "Beginner", "Intermediate", "Advanced"]

  const filteredCourses = useMemo(() => {
    return sampleCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
      const matchesLevel = selectedLevel === "all" || course.level === selectedLevel
      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [searchQuery, selectedCategory, selectedLevel])

  const featuredCourses = filteredCourses.filter((c) => c.featured)
  const otherCourses = filteredCourses.filter((c) => !c.featured)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Topbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Academy</h1>
            </div>
            <p className="text-muted-foreground">
              Master dropshipping with expert courses and step-by-step guidance
            </p>
          </div>

          {/* Hero Section */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-500/10">
            <CardContent className="p-8">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold mb-3">Master Dropshipping with Expert Courses</h2>
                <p className="text-muted-foreground mb-4">
                  Learn from industry experts and build a successful dropshipping business. Access
                  comprehensive courses covering everything from basics to advanced strategies.
                  Whether you're just starting or looking to scale, our courses provide step-by-step
                  guidance to help you succeed.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge>24/7 Access</Badge>
                  <Badge>Expert Instructors</Badge>
                  <Badge>Practical Exercises</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 Tip: Start with beginner courses if you're new to dropshipping, then progress
                  to intermediate and advanced topics as you gain experience.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat === "all" ? "All Categories" : cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level === "all" ? "All Levels" : level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Featured Courses */}
          {featuredCourses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Presentation className="h-5 w-5" />
                Featured Courses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {featuredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {/* Other Courses */}
          {otherCourses.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Book className="h-5 w-5" />
                All Courses
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {otherCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          )}

          {filteredCourses.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

