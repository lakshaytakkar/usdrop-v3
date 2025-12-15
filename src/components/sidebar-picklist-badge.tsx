"use client"

import { useEffect, useState } from "react"

export function SidebarPicklistBadge() {
  const [count, setCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch("/api/picklist")
        if (response.ok) {
          const data = await response.json()
          setCount(data.items?.length || 0)
        }
      } catch (error) {
        // Silently fail - badge just won't show
      } finally {
        setLoading(false)
      }
    }

    fetchCount()

    // Listen for picklist updates
    const handlePicklistUpdate = () => {
      fetchCount()
    }

    window.addEventListener("picklist-updated", handlePicklistUpdate)
    return () => {
      window.removeEventListener("picklist-updated", handlePicklistUpdate)
    }
  }, [])

  if (loading || count === 0) {
    return null
  }

  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  )
}
