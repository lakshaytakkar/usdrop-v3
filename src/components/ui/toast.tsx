"use client"

import { useEffect, useState } from "react"
import { useToast, Toast } from "@/hooks/use-toast"
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.duration])

  if (!isVisible) return null

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  }

  const styles = {
    success: "bg-green-50 text-green-900 border-green-200 dark:bg-green-950/20 dark:text-green-100 dark:border-green-800",
    error: "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/20 dark:text-red-100 dark:border-red-800",
    info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/20 dark:text-blue-100 dark:border-blue-800",
    warning: "bg-amber-50 text-amber-900 border-amber-200 dark:bg-amber-950/20 dark:text-amber-100 dark:border-amber-800",
  }

  const Icon = icons[toast.type]

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all",
        styles[toast.type]
      )}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium">{toast.message}</p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none group-hover:opacity-100"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}























