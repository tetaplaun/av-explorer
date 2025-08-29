import { useState, useCallback, useEffect } from "react"
import { useSettings } from "./useSettings"

interface NavigationState {
  currentPath: string
  history: string[]
  historyIndex: number
}

interface UseNavigationReturn {
  currentPath: string
  history: string[]
  historyIndex: number
  canGoBack: boolean
  canGoForward: boolean
  navigateTo: (path: string) => void
  goBack: () => void
  goForward: () => void
  goUp: () => void
  refresh: () => void
  clearHistory: () => void
}

export function useNavigation(initialPath: string = ""): UseNavigationReturn {
  const { settings, setSetting } = useSettings()
  const [state, setState] = useState<NavigationState>({
    currentPath: initialPath,
    history: initialPath ? [initialPath] : [],
    historyIndex: initialPath ? 0 : -1,
  })

  // Load initial path from settings
  useEffect(() => {
    if (settings?.lastPath && !state.currentPath) {
      setState({
        currentPath: settings.lastPath,
        history: [settings.lastPath],
        historyIndex: 0,
      })
    }
  }, [settings?.lastPath, state.currentPath])

  const navigateTo = useCallback(
    (path: string) => {
      if (path === state.currentPath) return

      setState((prev) => {
        // Remove any forward history when navigating to a new path
        const newHistory = prev.history.slice(0, prev.historyIndex + 1)
        newHistory.push(path)

        return {
          currentPath: path,
          history: newHistory,
          historyIndex: newHistory.length - 1,
        }
      })

      // Save to settings
      setSetting("lastPath", path)
    },
    [state.currentPath, setSetting]
  )

  const goBack = useCallback(() => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1
      const newPath = state.history[newIndex]

      setState((prev) => ({
        ...prev,
        currentPath: newPath,
        historyIndex: newIndex,
      }))

      setSetting("lastPath", newPath)
    }
  }, [state.historyIndex, state.history, setSetting])

  const goForward = useCallback(() => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      const newPath = state.history[newIndex]

      setState((prev) => ({
        ...prev,
        currentPath: newPath,
        historyIndex: newIndex,
      }))

      setSetting("lastPath", newPath)
    }
  }, [state.historyIndex, state.history, setSetting])

  const goUp = useCallback(() => {
    const segments = state.currentPath.split(/[\\/]/).filter(Boolean)
    if (segments.length <= 1) return // Already at root

    segments.pop()
    const isWindowsPath = /^[A-Za-z]:?$/.test(segments[0])
    const parentPath = isWindowsPath
      ? segments.join("\\") + (segments.length === 1 ? "\\" : "")
      : "/" + segments.join("/")

    navigateTo(parentPath)
  }, [state.currentPath, navigateTo])

  const refresh = useCallback(() => {
    // This is a no-op for navigation state, but can be extended for file operations
    // The actual refresh logic should be handled by the component using this hook
  }, [])

  const clearHistory = useCallback(() => {
    setState((prev) => ({
      currentPath: prev.currentPath,
      history: [prev.currentPath],
      historyIndex: 0,
    }))
  }, [])

  return {
    currentPath: state.currentPath,
    history: state.history,
    historyIndex: state.historyIndex,
    canGoBack: state.historyIndex > 0,
    canGoForward: state.historyIndex < state.history.length - 1,
    navigateTo,
    goBack,
    goForward,
    goUp,
    refresh,
    clearHistory,
  }
}

// Utility functions for path operations
export const pathUtils = {
  isRoot: (path: string): boolean => {
    if (!path || path.trim() === "") return true
    if (/^[A-Za-z]:\\?$/.test(path)) return true // Windows drive root
    if (path === "/") return true // Unix root
    return false
  },

  getParentPath: (path: string): string => {
    const segments = path.split(/[\\/]/).filter(Boolean)
    if (segments.length <= 1) return path

    segments.pop()
    const isWindowsPath = /^[A-Za-z]:?$/.test(segments[0])
    return isWindowsPath
      ? segments.join("\\") + (segments.length === 1 ? "\\" : "")
      : "/" + segments.join("/")
  },

  getPathSegments: (path: string): string[] => {
    return path.split(/[\\/]/).filter(Boolean)
  },

  joinPath: (...segments: string[]): string => {
    const filtered = segments.filter(Boolean)
    if (filtered.length === 0) return ""

    const firstSegment = filtered[0]
    const isWindowsPath = /^[A-Za-z]:?$/.test(firstSegment)

    if (isWindowsPath) {
      return filtered.join("\\")
    } else {
      return "/" + filtered.filter((s) => s !== "/").join("/")
    }
  },

  normalizePath: (path: string): string => {
    // Normalize path separators and remove duplicate separators
    return path.replace(/[\\/]+/g, "/").replace(/\/$/, "") || "/"
  },
}
