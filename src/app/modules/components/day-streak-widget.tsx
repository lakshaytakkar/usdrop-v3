"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Flame, Calendar } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface DayStreakWidgetProps {
  streakDays?: number
  isLoading?: boolean
}

// Get streak from localStorage or calculate from activity
function getStreakFromStorage(): number {
  if (typeof window === 'undefined') return 0
  
  try {
    const lastActivity = localStorage.getItem('usdrop-last-activity-date')
    const streak = localStorage.getItem('usdrop-streak-days')
    
    if (!lastActivity || !streak) return 0
    
    const lastDate = new Date(lastActivity)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    lastDate.setHours(0, 0, 0, 0)
    
    const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // If last activity was yesterday, continue streak
    if (daysDiff === 1) {
      const currentStreak = parseInt(streak, 10) + 1
      localStorage.setItem('usdrop-streak-days', currentStreak.toString())
      localStorage.setItem('usdrop-last-activity-date', today.toISOString())
      return currentStreak
    }
    
    // If last activity was today, return current streak
    if (daysDiff === 0) {
      return parseInt(streak, 10)
    }
    
    // Streak broken, reset
    localStorage.setItem('usdrop-streak-days', '0')
    return 0
  } catch {
    return 0
  }
}

// Get week days with completion status
function getWeekDays(streakDays: number): Array<{ day: string; completed: boolean }> {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const today = new Date().getDay()
  const weekDays: Array<{ day: string; completed: boolean }> = []
  
  // Start from Sunday
  for (let i = 0; i < 7; i++) {
    const dayIndex = (today - 6 + i + 7) % 7 // Get days from last Sunday
    weekDays.push({
      day: days[dayIndex],
      completed: i < streakDays && streakDays > 0
    })
  }
  
  return weekDays
}

export function DayStreakWidget({ streakDays: propStreakDays, isLoading }: DayStreakWidgetProps) {
  const [streakDays, setStreakDays] = useState(0)

  useEffect(() => {
    if (propStreakDays !== undefined) {
      setStreakDays(propStreakDays)
    } else {
      // Get from localStorage
      const storedStreak = getStreakFromStorage()
      setStreakDays(storedStreak)
    }
  }, [propStreakDays])

  // Update activity on mount (user is viewing dashboard = activity)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toISOString()
      localStorage.setItem('usdrop-last-activity-date', today)
    }
  }, [])

  if (isLoading) {
    return (
      <Card className="border-border/50 h-full">
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    )
  }

  const weekDays = getWeekDays(streakDays)
  const motivationMessages = [
    "Keep it up!",
    "You're on fire!",
    "Amazing streak!",
    "Don't break the chain!",
    "Consistency is key!"
  ]
  const motivationMessage = streakDays > 0 
    ? motivationMessages[Math.min(streakDays - 1, motivationMessages.length - 1)]
    : "Start your streak today!"

  return (
    <Card className="bg-white border border-[#e6e6e6] rounded-xl shadow-sm h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-4 justify-center mb-4">
          <div className="flex flex-col gap-4 flex-1">
            <h3 className="text-base font-medium text-[#1b1b1b] leading-[1.2]">
              Day Streak
            </h3>
            <p className="text-2xl font-medium text-[#111113] leading-normal">
              {streakDays} {streakDays === 1 ? 'Day' : 'Days'}
            </p>
          </div>
          <div className="relative size-[55px] shrink-0">
            <Flame className="size-full text-orange-500" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-[#f6f8fa] rounded-xl p-3">
          <div className="flex items-center justify-between">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <div
                  className={cn(
                    "size-6 rounded-full flex items-center justify-center text-xs font-medium",
                    day.completed
                      ? "bg-[#0e66fe] text-white"
                      : "bg-transparent"
                  )}
                >
                  {day.completed ? (
                    <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  ) : (
                    <span className="text-[#030616] opacity-50">{day.day[0]}</span>
                  )}
                </div>
                <span className="text-sm text-[#030616] opacity-50 font-medium leading-[1.2]">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

