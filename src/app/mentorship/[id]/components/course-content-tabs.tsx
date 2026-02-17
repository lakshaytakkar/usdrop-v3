"use client"

import { Course, CourseChapter } from "@/types/courses"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "./overview-tab"
import { FilesTab } from "./files-tab"
import { NotesTab } from "./notes-tab"
import { QATab } from "./qa-tab"
import { ReviewsTab } from "./reviews-tab"

interface CourseContentTabsProps {
  course: Course
  chapter: CourseChapter
  moduleId: string
}

export function CourseContentTabs({
  course,
  chapter,
  moduleId,
}: CourseContentTabsProps) {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="qa">Q&A</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="mt-6">
        <OverviewTab course={course} chapter={chapter} />
      </TabsContent>

      <TabsContent value="files" className="mt-6">
        <FilesTab chapter={chapter} />
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <NotesTab chapterId={chapter.id} />
      </TabsContent>

      <TabsContent value="qa" className="mt-6">
        <QATab courseId={course.id} chapterId={chapter.id} />
      </TabsContent>

      <TabsContent value="reviews" className="mt-6">
        <ReviewsTab courseId={course.id} />
      </TabsContent>
    </Tabs>
  )
}







