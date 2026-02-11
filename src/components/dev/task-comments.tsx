"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

async function fetchComments(taskId: string) {
  const response = await fetch(`/api/dev/tasks/${taskId}/comments`)
  if (!response.ok) {
    throw new Error("Failed to fetch comments")
  }
  return response.json()
}

export function TaskComments({ taskId }: { taskId: string }) {
  const [commentText, setCommentText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useToast()
  const { user } = useAuth()

  const { data: comments, isLoading } = useQuery({
    queryKey: ["dev-task-comments", taskId],
    queryFn: () => fetchComments(taskId),
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/dev/tasks/${taskId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_text: commentText }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      setCommentText("")
      queryClient.invalidateQueries({ queryKey: ["dev-task-comments", taskId] })
      showSuccess("Your comment has been added successfully.")
    } catch (error) {
      console.error("Error adding comment:", error)
      showError("Failed to add comment. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          rows={4}
        />
        <Button type="submit" disabled={isSubmitting || !commentText.trim()}>
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map((comment: any) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.user?.avatar_url || undefined} alt={comment.user?.full_name || ''} />
                <AvatarFallback>
                  {(comment.user?.full_name || comment.user?.email || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {comment.user?.full_name || comment.user?.email || "Unknown User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                  {comment.is_system_log && (
                    <span className="text-xs text-muted-foreground italic">(System)</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {comment.comment_text}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  )
}




