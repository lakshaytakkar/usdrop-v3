"use client"

import { Course, CourseModule } from "@/types/courses"
import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OverviewTabProps {
  course: Course
  module: CourseModule
}

export function OverviewTab({ course, module }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-semibold">{module.title}</h2>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Flag className="h-4 w-4 mr-2" />
          Report
        </Button>
      </div>

      {module.description && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Description</h3>
          <p className="text-muted-foreground whitespace-pre-wrap">{module.description}</p>
        </div>
      )}

      {course.prerequisites && course.prerequisites.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Requirements</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {course.prerequisites.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {course.learning_objectives && course.learning_objectives.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Learning Outcomes</h3>
          <ul className="list-disc list-inside space-y-1 text-muted-foreground">
            {course.learning_objectives.map((outcome, index) => (
              <li key={index}>{outcome}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-6">
        <div className="w-44 h-32 bg-muted rounded-lg flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Certificate</span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-2">Course Certificate</h3>
          <p className="text-muted-foreground mb-4">
            Upon completion of this course, you will receive a certificate of completion that you can share on your professional profile.
          </p>
          <Button variant="link" className="p-0 h-auto">
            Show Example
          </Button>
        </div>
      </div>
    </div>
  )
}
