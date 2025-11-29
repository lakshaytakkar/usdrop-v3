"use client"

import { useState, useCallback, useEffect } from "react"

export type ToastType = "success" | "error" | "info" | "warning"

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

let toastListeners: Array<(toasts: Toast[]) => void> = []
let toasts: Toast[] = []

function notify() {
  toastListeners.forEach((listener) => listener([...toasts]))
}

export function useToast() {
  const [toastState, setToastState] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToastState(newToasts)
    }
    toastListeners.push(listener)
    setToastState([...toasts])

    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 3000) => {
      const id = Math.random().toString(36).substring(7)
      const toast: Toast = { id, type, message, duration }
      toasts = [...toasts, toast]
      notify()

      setTimeout(() => {
        toasts = toasts.filter((t) => t.id !== id)
        notify()
      }, duration)
    },
    []
  )

  const showSuccess = useCallback((message: string) => {
    showToast("success", message)
  }, [showToast])

  const showError = useCallback((message: string) => {
    showToast("error", message)
  }, [showToast])

  const showInfo = useCallback((message: string) => {
    showToast("info", message)
  }, [showToast])

  const showWarning = useCallback((message: string) => {
    showToast("warning", message)
  }, [showToast])

  return {
    toasts: toastState,
    showToast,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
