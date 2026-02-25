

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
      <TabsList className="grid w-full grid-cols-2 h-8">
        <TabsTrigger value="files" className="text-xs">Files</TabsTrigger>
        <TabsTrigger value="notes" className="text-xs">Notes</TabsTrigger>
      </TabsList>

      <TabsContent value="files" className="mt-2">
        <FilesTab module={module} />
      </TabsContent>

      <TabsContent value="notes" className="mt-2">
        <NotesTab moduleId={module.id} />
      </TabsContent>
    </Tabs>
  )
}
