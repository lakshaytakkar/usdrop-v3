

import { apiFetch } from '@/lib/supabase'
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Edit, Trash2, Plus, Loader2 } from "lucide-react"
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
  timestamp_seconds: number
  text: string
  created_at: string
}

interface NotesTabProps {
  moduleId: string
}

export function NotesTab({ moduleId }: NotesTabProps) {
  const [notes, setNotes] = useState<Note[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [noteText, setNoteText] = useState("")
  const [timestamp, setTimestamp] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [moduleId])

  const fetchNotes = async () => {
    try {
      const res = await apiFetch(`/api/course-notes?moduleId=${moduleId}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setNotes(data.notes || [])
      }
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = async () => {
    if (!noteText.trim()) return
    setSaving(true)
    try {
      const res = await apiFetch("/api/course-notes", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ moduleId, text: noteText, timestamp_seconds: timestamp }),
      })
      if (res.ok) {
        const data = await res.json()
        setNotes([...notes, data.note])
      }
    } catch (error) {
      console.error('Failed to create note:', error)
    } finally {
      setSaving(false)
      setNoteText("")
      setIsDialogOpen(false)
    }
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNoteText(note.text)
    setTimestamp(note.timestamp_seconds)
    setIsDialogOpen(true)
  }

  const handleUpdateNote = async () => {
    if (!editingNote || !noteText.trim()) return
    setSaving(true)
    try {
      const res = await apiFetch("/api/course-notes", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: editingNote.id, text: noteText, timestamp_seconds: timestamp }),
      })
      if (res.ok) {
        const data = await res.json()
        setNotes(notes.map((n) => n.id === editingNote.id ? data.note : n))
      }
    } catch (error) {
      console.error('Failed to update note:', error)
    } finally {
      setSaving(false)
      setEditingNote(null)
      setNoteText("")
      setTimestamp(0)
      setIsDialogOpen(false)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await apiFetch(`/api/course-notes?id=${noteId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setNotes(notes.filter((n) => n.id !== noteId))
      }
    } catch (error) {
      console.error('Failed to delete note:', error)
    }
  }

  const formatTimestamp = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
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
                disabled={!noteText.trim() || saving}
              >
                {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
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
                  {formatTimestamp(note.timestamp_seconds)}
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
