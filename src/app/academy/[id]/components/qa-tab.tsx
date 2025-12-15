"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, ThumbsUp, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface Question {
  id: string
  userId: string
  userName: string
  userAvatar: string | null
  question: string
  likes: number
  comments: number
  createdAt: string
}

interface QATabProps {
  courseId: string
  chapterId: string
}

export function QATab({ courseId, chapterId }: QATabProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [questionText, setQuestionText] = useState("")

  // TODO: Fetch questions from API
  // useEffect(() => {
  //   fetch(`/api/courses/${courseId}/chapters/${chapterId}/questions`)
  //     .then(res => res.json())
  //     .then(data => setQuestions(data.questions))
  // }, [courseId, chapterId])

  const handleAddQuestion = () => {
    // TODO: Submit to API
    const newQuestion: Question = {
      id: Date.now().toString(),
      userId: "current-user-id", // TODO: Get from auth
      userName: "You",
      userAvatar: null,
      question: questionText,
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    }

    setQuestions([newQuestion, ...questions])
    setQuestionText("")
    setIsDialogOpen(false)
  }

  const handleLike = (questionId: string) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, likes: q.likes + 1 } : q
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ask a Question</DialogTitle>
              <DialogDescription>
                Ask a question about this chapter to get help from instructors and other students.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Enter your question..."
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddQuestion} disabled={!questionText.trim()}>
                Post Question
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No questions yet. Be the first to ask a question!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={question.userAvatar || undefined} />
                  <AvatarFallback>{question.userName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{question.userName}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(question.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{question.question}</p>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(question.id)}
                      className="h-8"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      {question.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {question.comments}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}







