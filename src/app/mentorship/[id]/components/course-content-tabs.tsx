"use client"

import { CourseModule } from "@/types/courses"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FilesTab } from "./files-tab"
import { NotesTab } from "./notes-tab"

interface CourseContentTabsProps {
  module: CourseModule
}

export function CourseContentTabs({ module }: CourseContentTabsProps) {
  return (
    <Tabs defaultValue="files" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="files">Files</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="files" className="mt-6">
        <FilesTab module={module} />
      </TabsContent>

      <TabsContent value="notes" className="mt-6">
        <NotesTab moduleId={module.id} />
      </TabsContent>
    </Tabs>
  )
}
