import { apiFetch } from '@/lib/supabase'
import { useState, useEffect, useCallback } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/contexts/auth-context"
import {
  Plus,
  Trash2,
  Save,
  FlaskConical,
} from "lucide-react"

type RnDCategory = "learning" | "products" | "ads" | "store" | "research" | "fulfilment" | "other"

interface RnDEntry {
  id: string
  date: string
  category: RnDCategory
  hours: number
  description: string
}

const CATEGORY_OPTIONS: { value: RnDCategory; label: string; color: string; bg: string }[] = [
  { value: "learning", label: "Learning", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  { value: "products", label: "Products", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  { value: "ads", label: "Ads", color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  { value: "store", label: "Store", color: "text-orange-700", bg: "bg-orange-50 border-orange-200" },
  { value: "research", label: "Research", color: "text-pink-700", bg: "bg-pink-50 border-pink-200" },
  { value: "fulfilment", label: "Fulfilment", color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
  { value: "other", label: "Other", color: "text-gray-700", bg: "bg-gray-50 border-gray-200" },
]

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

function getTodayStr() {
  return new Date().toISOString().split('T')[0]
}

export default function MyRnDPage() {
  const { user, loading: authLoading } = useAuth()
  const [entries, setEntries] = useState<RnDEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setIsLoading(false); return }

    let cancelled = false
    const fetchEntries = async () => {
      try {
        const res = await apiFetch("/api/rnd-entries", { credentials: 'include' })
        if (res.ok && !cancelled) {
          const data = await res.json()
          setEntries(data.entries || [])
        }
      } catch (error) {
        console.error('Failed to load R&D entries:', error)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    fetchEntries()
    return () => { cancelled = true }
  }, [authLoading, user])

  const addEntry = useCallback(() => {
    const newEntry: RnDEntry = {
      id: generateId(),
      date: getTodayStr(),
      category: "learning",
      hours: 1,
      description: "",
    }
    setEntries(prev => [newEntry, ...prev])
    setHasChanges(true)
  }, [])

  const updateEntry = useCallback((id: string, field: keyof RnDEntry, value: string | number) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))
    setHasChanges(true)
  }, [])

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
    setHasChanges(true)
  }, [])

  const saveEntries = useCallback(async () => {
    setIsSaving(true)
    try {
      const res = await apiFetch("/api/rnd-entries", {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ entries }),
        credentials: 'include',
      })
      if (res.ok) {
        setHasChanges(false)
      }
    } catch (error) {
      console.error('Failed to save R&D entries:', error)
    } finally {
      setIsSaving(false)
    }
  }, [entries])

  const totalHours = entries.reduce((sum, e) => sum + (e.hours || 0), 0)
  const todayEntries = entries.filter(e => e.date === getTodayStr())
  const todayHours = todayEntries.reduce((sum, e) => sum + (e.hours || 0), 0)

  if (isLoading) {
    return (
      <div className="px-12 md:px-20 lg:px-32 py-8 max-w-[1200px] mx-auto">
        <Skeleton className="h-8 w-48 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="px-12 md:px-20 lg:px-32 py-8 max-w-[1200px] mx-auto" data-testid="page-my-rnd">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-blue-600" />
            My R&D Workspace
          </h1>
          <p className="text-gray-500 mt-1 text-[15px]">
            Track your daily work, learning, and research in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-500 mr-2">
            <span>Today: <strong className="text-gray-800">{todayHours}h</strong></span>
            <span>Total: <strong className="text-gray-800">{totalHours}h</strong></span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={addEntry}
            className="gap-1.5"
            data-testid="button-add-entry"
          >
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
          {hasChanges && (
            <Button
              size="sm"
              onClick={saveEntries}
              disabled={isSaving}
              className="gap-1.5"
              data-testid="button-save-entries"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>

      <Card className="overflow-hidden border border-gray-200 rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" data-testid="table-rnd-entries">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-[130px]">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-[140px]">Category</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 w-[80px]">Hours</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Work Summary / Notes</th>
                <th className="py-3 px-4 w-[50px]"></th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-gray-400">
                    <FlaskConical className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-base font-medium text-gray-500 mb-1">No entries yet</p>
                    <p className="text-sm">Click "Add Entry" to start logging your daily work and learning.</p>
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors" data-testid={`row-rnd-${entry.id}`}>
                    <td className="py-2.5 px-4">
                      <input
                        type="date"
                        value={entry.date}
                        onChange={(e) => updateEntry(entry.id, 'date', e.target.value)}
                        className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 rounded px-2 py-1.5 text-sm outline-none transition-all"
                        data-testid={`input-date-${entry.id}`}
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <select
                        value={entry.category}
                        onChange={(e) => updateEntry(entry.id, 'category', e.target.value)}
                        className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 rounded px-2 py-1.5 text-sm outline-none transition-all cursor-pointer"
                        data-testid={`select-category-${entry.id}`}
                      >
                        {CATEGORY_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2.5 px-4">
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={entry.hours}
                        onChange={(e) => updateEntry(entry.id, 'hours', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 rounded px-2 py-1.5 text-sm outline-none transition-all text-center"
                        data-testid={`input-hours-${entry.id}`}
                      />
                    </td>
                    <td className="py-2.5 px-4">
                      <textarea
                        value={entry.description}
                        onChange={(e) => updateEntry(entry.id, 'description', e.target.value)}
                        placeholder="• What did you work on? What did you watch/learn?"
                        rows={1}
                        className="w-full bg-transparent border border-transparent hover:border-gray-200 focus:border-blue-300 focus:ring-1 focus:ring-blue-100 rounded px-2 py-1.5 text-sm outline-none transition-all resize-y min-h-[36px]"
                        data-testid={`input-description-${entry.id}`}
                      />
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1 cursor-pointer"
                        data-testid={`button-delete-${entry.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {entries.length > 0 && (
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories:</span>
          {CATEGORY_OPTIONS.map(opt => {
            const count = entries.filter(e => e.category === opt.value).length
            if (count === 0) return null
            return (
              <span
                key={opt.value}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${opt.bg} ${opt.color}`}
              >
                {opt.label} ({count})
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}
