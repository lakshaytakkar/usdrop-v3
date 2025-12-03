"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Settings, Image as ImageIcon, Save } from "lucide-react"
import { Course } from "../data/courses"
import Image from "next/image"

interface CourseSettingsPanelProps {
  course: Course
  onSave?: (course: Course) => void
}

export function CourseSettingsPanel({
  course,
  onSave,
}: CourseSettingsPanelProps) {
  const [formData, setFormData] = useState({
    title: course.title,
    slug: course.slug,
    description: course.description,
    instructor_id: course.instructor_id || "",
    instructor_name: course.instructor_name,
    thumbnail: course.thumbnail || "",
    category: course.category || "",
    level: course.level || "",
    price: course.price,
    featured: course.featured,
    published: course.published,
  })

  useEffect(() => {
    setFormData({
      title: course.title,
      slug: course.slug,
      description: course.description,
      instructor_id: course.instructor_id || "",
      instructor_name: course.instructor_name,
      thumbnail: course.thumbnail || "",
      category: course.category || "",
      level: course.level || "",
      price: course.price,
      featured: course.featured,
      published: course.published,
    })
  }, [course])

  const handleSave = () => {
    if (!onSave) return
    onSave({
      ...course,
      ...formData,
      instructor_id: formData.instructor_id || null,
      level: (formData.level as "Beginner" | "Intermediate" | "Advanced" | null) || null,
      category: formData.category || null,
      thumbnail: formData.thumbnail || null,
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-sm font-semibold">Course Settings</h2>
        {onSave && (
          <Button size="sm" onClick={handleSave} className="cursor-pointer">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Thumbnail */}
        <div className="space-y-2">
          <Label>Thumbnail</Label>
          {formData.thumbnail ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted border">
              <Image
                src={formData.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
                sizes="100%"
              />
            </div>
          ) : (
            <div className="w-full h-48 rounded-lg border-2 border-dashed border-muted flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
          <Input
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            placeholder="Thumbnail URL"
          />
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Business, Marketing"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select
              value={formData.level || ""}
              onValueChange={(value) => setFormData({ ...formData, level: value as any })}
            >
              <SelectTrigger id="level">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        {/* Publishing */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="published">Published</Label>
              <p className="text-xs text-muted-foreground">Make course available to students</p>
            </div>
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="featured">Featured</Label>
              <p className="text-xs text-muted-foreground">Highlight this course</p>
            </div>
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="h-4 w-4"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-2 border-t pt-4">
          <Label>Statistics</Label>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Modules</p>
              <p className="font-semibold">{course.modules?.length || 0}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Chapters</p>
              <p className="font-semibold">
                {course.modules?.reduce((sum, m) => sum + (m.chapters?.length || 0), 0) || 0}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Students</p>
              <p className="font-semibold">{course.students_count}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rating</p>
              <p className="font-semibold">{course.rating?.toFixed(1) || "—"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}




