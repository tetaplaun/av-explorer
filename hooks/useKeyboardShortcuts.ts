"use client"

import { useEffect, useCallback } from "react"

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: () => void
  description: string
  preventDefault?: boolean
}

export interface UseKeyboardShortcutsOptions {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsOptions) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.contentEditable === "true"
      ) {
        return
      }

      const matchingShortcut = shortcuts.find((shortcut) => {
        const keyMatches = shortcut.key.toLowerCase() === event.key.toLowerCase()
        const ctrlMatches = !!shortcut.ctrl === event.ctrlKey
        const shiftMatches = !!shortcut.shift === event.shiftKey
        const altMatches = !!shortcut.alt === event.altKey
        const metaMatches = !!shortcut.meta === (event.metaKey || event.ctrlKey)

        return keyMatches && ctrlMatches && shiftMatches && altMatches && metaMatches
      })

      if (matchingShortcut) {
        if (matchingShortcut.preventDefault !== false) {
          event.preventDefault()
        }
        matchingShortcut.handler()
      }
    },
    [shortcuts, enabled]
  )

  useEffect(() => {
    if (enabled) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown, enabled])

  return {
    shortcuts,
  }
}

// Predefined shortcuts for file explorer
export const createFileExplorerShortcuts = (handlers: {
  onBack?: () => void
  onForward?: () => void
  onUp?: () => void
  onRefresh?: () => void
  onSelectAll?: () => void
  onToggleSearch?: () => void
  onOpenSelected?: () => void
  onToggleMultiSelect?: () => void
  onDeleteSelected?: () => void
  onSettings?: () => void
}): KeyboardShortcut[] => {
  const shortcuts: KeyboardShortcut[] = []

  if (handlers.onBack) {
    shortcuts.push({
      key: "ArrowLeft",
      alt: true,
      handler: handlers.onBack,
      description: "Go back",
    })
  }

  if (handlers.onForward) {
    shortcuts.push({
      key: "ArrowRight",
      alt: true,
      handler: handlers.onForward,
      description: "Go forward",
    })
  }

  if (handlers.onUp) {
    shortcuts.push({
      key: "Backspace",
      handler: handlers.onUp,
      description: "Go up one directory",
    })
  }

  if (handlers.onRefresh) {
    shortcuts.push({
      key: "F5",
      handler: handlers.onRefresh,
      description: "Refresh directory",
    })
  }

  if (handlers.onSelectAll) {
    shortcuts.push({
      key: "a",
      ctrl: true,
      handler: handlers.onSelectAll,
      description: "Select all files",
    })
  }

  if (handlers.onToggleSearch) {
    shortcuts.push({
      key: "f",
      ctrl: true,
      handler: handlers.onToggleSearch,
      description: "Toggle search",
    })
  }

  if (handlers.onOpenSelected) {
    shortcuts.push({
      key: "Enter",
      handler: handlers.onOpenSelected,
      description: "Open selected file/directory",
    })
  }

  if (handlers.onToggleMultiSelect) {
    shortcuts.push({
      key: "m",
      ctrl: true,
      handler: handlers.onToggleMultiSelect,
      description: "Toggle multi-select mode",
    })
  }

  if (handlers.onDeleteSelected) {
    shortcuts.push({
      key: "Delete",
      handler: handlers.onDeleteSelected,
      description: "Delete selected files",
    })
  }

  if (handlers.onSettings) {
    shortcuts.push({
      key: ",",
      ctrl: true,
      handler: handlers.onSettings,
      description: "Open settings",
    })
  }

  return shortcuts
}
