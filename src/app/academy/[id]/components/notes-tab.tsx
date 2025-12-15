"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Note {
  id: string
  timestamp: number
  text: string
  createdAt: string
}

interface NotesTabProps {
  chapterId: string
}

export function NotesTab({ chapterId }: NotesTabProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteText, setNoteText] = useState("")
  const [timestamp, setTimestamp] = useState(0)

  // Load notes from localStorage
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${chapterId}`)
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [chapterId])

  // Save notes to localStorage
  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes)
    localStorage.setItem(`notes-${chapterId}`, JSON.stringify(newNotes))
  }

  const handleCreateNote = () => {
    // Get current video timestamp (would come from video player in real implementation)
    const currentTimestamp = timestamp // TODO: Get from video player
    
    const newNote: Note = {
      id: Date.now().toString(),
      timestamp: currentTimestamp,
      text: noteText,
      createdAt: new Date().toISOString(),
    }

    saveNotes([...notes, newNote])
    setNoteText("")
    setIsDialogOpen(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNoteText(note.text)
    setTimestamp(note.timestamp)
    setIsDialogOpen(true)
  }

  const handleUpdateNote = () => {
    if (!editingNote) return

    const updatedNotes = notes.map((note) =>
      note.id === editingNote.id
        ? { ...note, text: noteText, timestamp }
        : note
    )

    saveNotes(updatedNotes)
    setEditingNote(null)
    setNoteText("")
    setTimestamp(0)
    setIsDialogOpen(false)
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    saveNotes(updatedNotes)
  }

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Notes</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => {
              setEditingNote(null)
              setNoteText("")
              setTimestamp(0)
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Create Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
              <DialogDescription>
                Add a note at the current video timestamp
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Timestamp</label>
                <p className="text-sm text-muted-foreground">{formatTimestamp(timestamp)}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Note</label>
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your note..."
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={editingNote ? handleUpdateNote : handleCreateNote}
                disabled={!noteText.trim()}
              >
                {editingNote ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>No notes yet. Create your first note to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="flex gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="px-3 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                  {formatTimestamp(note.timestamp)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm whitespace-pre-wrap">{note.text}</p>
              </div>
              <div className="flex-shrink-0 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditNote(note)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteNote(note.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}







