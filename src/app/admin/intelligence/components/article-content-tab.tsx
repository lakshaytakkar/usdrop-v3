"use client"

import { ArticleEditor } from "./article-editor"

interface ArticleContentTabProps {
  content: string
  onContentChange: (content: string) => void
}

export function ArticleContentTab({
  content,
  onContentChange,
}: ArticleContentTabProps) {
  return (
    <div className="space-y-4">
      <ArticleEditor
        content={content}
        onChange={onContentChange}
        autoSave={true}
        onAutoSave={(savedContent) => {
          // Auto-save functionality
          console.log("Auto-saving:", savedContent.length, "characters")
        }}
      />
    </div>
  )
}

