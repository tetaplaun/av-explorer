"use client"

import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title: string
  description?: string
  type: "success" | "error" | "warning" | "info"
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, type: "success", duration })
    },
    [addToast]
  )

  const error = useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, type: "error", duration })
    },
    [addToast]
  )

  const warning = useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, type: "warning", duration })
    },
    [addToast]
  )

  const info = useCallback(
    (title: string, description?: string, duration?: number) => {
      return addToast({ title, description, type: "info", duration })
    },
    [addToast]
  )

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  }
}
