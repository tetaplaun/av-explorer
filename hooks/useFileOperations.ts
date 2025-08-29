import { useState, useCallback, useEffect } from "react"
import { FileItem } from "@/types/explorer"
import { useAsyncOperation } from "./useAsyncOperation"

interface FileOperationResult {
  success: boolean
  error?: string
  path: string
}

interface UseFileOperationsReturn {
  files: FileItem[]
  loading: boolean
  error: string | null
  loadFiles: (path: string) => Promise<void>
  refreshFiles: () => Promise<void>
  syncFileDates: (
    files: FileItem[],
    options: { setCreationDate: boolean; setModifiedDate: boolean }
  ) => Promise<void>
  getEncodedDates: (files: FileItem[]) => Promise<void>
  openFile: (path: string) => Promise<FileOperationResult>
  showInFolder: (path: string) => Promise<FileOperationResult>
  getDrives: () => Promise<any[]>
  getPathInfo: (path: string) => Promise<any>
  clearError: () => void
}

export function useFileOperations(initialPath?: string): UseFileOperationsReturn {
  const [files, setFiles] = useState<FileItem[]>([])
  const [currentPath, setCurrentPath] = useState<string>(initialPath || "")

  const loadFilesOperation = useAsyncOperation({
    maxRetries: 2,
    onError: (error) => {
      console.error("Failed to load files:", error)
    },
  })

  const syncDatesOperation = useAsyncOperation({
    maxRetries: 1, // Only retry once for sync operations
    onError: (error) => {
      console.error("Failed to sync file dates:", error)
    },
  })

  const encodedDatesOperation = useAsyncOperation({
    maxRetries: 1,
    onError: (error) => {
      console.error("Failed to load encoded dates:", error)
      // Don't show error for encoded dates - it's not critical
    },
  })

  const loadFiles = useCallback(
    async (path: string) => {
      if (!path || path.trim() === "") {
        setFiles([])
        return
      }

      const result = await loadFilesOperation.execute(async () => {
        const items = await window.electronAPI.fileSystem.readDirectory(path)

        // Add parent directory entry if we're in a subdirectory
        let displayItems = [...items]
        if (shouldShowParentDirectory(path)) {
          const parentEntry: FileItem = {
            name: "..",
            path: getParentPath(path),
            isDirectory: true,
            size: 0,
            modified: null,
            created: null,
            extension: "",
            mediaType: null,
          }
          displayItems = [parentEntry, ...items]
        }

        setFiles(displayItems)
        setCurrentPath(path)
        return displayItems
      })

      if (result) {
        // Load encoded dates asynchronously after displaying files
        loadEncodedDates(result.filter((item) => item.name !== ".."))
      }
    },
    [loadFilesOperation]
  )

  const refreshFiles = useCallback(async () => {
    if (currentPath) {
      await loadFiles(currentPath)
    }
  }, [currentPath, loadFiles])

  const syncFileDates = useCallback(
    async (
      selectedFiles: FileItem[],
      options: { setCreationDate: boolean; setModifiedDate: boolean }
    ) => {
      const filesToSync = selectedFiles.filter(
        (file) => file.encodedDate !== null && file.encodedDate !== undefined
      )

      if (filesToSync.length === 0) return

      await syncDatesOperation.execute(async () => {
        const results = await window.electronAPI.fileSystem.setFileDates(filesToSync, options)
        return results
      })
    },
    [syncDatesOperation]
  )

  const loadEncodedDates = useCallback(
    async (items: FileItem[]) => {
      // Only process media files
      const mediaFiles = items.filter(
        (item) =>
          item.mediaType === "video" || item.mediaType === "audio" || item.mediaType === "image"
      )

      if (mediaFiles.length === 0) return

      const result = await encodedDatesOperation.execute(async () => {
        const encodedDates = await window.electronAPI.fileSystem.getEncodedDates(mediaFiles)

        // Update files with encoded dates
        setFiles((prevFiles) =>
          prevFiles.map((file) => {
            const encodedDate = encodedDates[file.path]
            if (encodedDate) {
              return { ...file, encodedDate }
            }
            return file
          })
        )

        return encodedDates
      })

      return result
    },
    [encodedDatesOperation]
  )

  const openFile = useCallback(async (path: string): Promise<FileOperationResult> => {
    try {
      const result = await window.electronAPI.fileSystem.openFile(path)
      return {
        success: result.success,
        error: result.error,
        path,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        path,
      }
    }
  }, [])

  const showInFolder = useCallback(async (path: string): Promise<FileOperationResult> => {
    try {
      const result = await window.electronAPI.fileSystem.showItemInFolder(path)
      return {
        success: result.success,
        error: result.error,
        path,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        path,
      }
    }
  }, [])

  const getDrives = useCallback(async () => {
    try {
      return await window.electronAPI.fileSystem.getDrives()
    } catch (error) {
      console.error("Failed to get drives:", error)
      return []
    }
  }, [])

  const getPathInfo = useCallback(async (path: string) => {
    try {
      return await window.electronAPI.fileSystem.getPathInfo(path)
    } catch (error) {
      console.error("Failed to get path info:", error)
      return { exists: false, error: "Failed to get path information" }
    }
  }, [])

  const clearError = useCallback(() => {
    loadFilesOperation.reset()
    syncDatesOperation.reset()
    encodedDatesOperation.reset()
  }, [loadFilesOperation, syncDatesOperation, encodedDatesOperation])

  // Helper functions
  const shouldShowParentDirectory = (path: string): boolean => {
    if (!path) return false

    // Check for Windows drive root (e.g., "C:\")
    if (/^[A-Za-z]:\\?$/.test(path)) return false

    // Check for Unix root
    if (path === "/") return false

    return true
  }

  const getParentPath = (path: string): string => {
    const segments = path.split(/[\\/]/).filter(Boolean)
    if (segments.length <= 1) return path // Already at root

    segments.pop()
    const isWindowsPath = /^[A-Za-z]:?$/.test(segments[0])
    return isWindowsPath
      ? segments.join("\\") + (segments.length === 1 ? "\\" : "")
      : "/" + segments.join("/")
  }

  // Load initial files if path is provided
  useEffect(() => {
    if (initialPath) {
      loadFiles(initialPath)
    }
  }, [initialPath]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    files,
    loading: loadFilesOperation.loading,
    error: loadFilesOperation.error?.message || null,
    loadFiles,
    refreshFiles,
    syncFileDates,
    getEncodedDates: loadEncodedDates,
    openFile,
    showInFolder,
    getDrives,
    getPathInfo,
    clearError,
  }
}
