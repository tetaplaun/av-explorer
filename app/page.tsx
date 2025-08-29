"use client"

import { useState, useEffect } from "react"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DrivesBar } from "@/components/explorer/DrivesBar"
import { DirectoryTree } from "@/components/explorer/DirectoryTree"
import { FilesList } from "@/components/explorer/FilesList"
import { Toolbar } from "@/components/explorer/Toolbar"
import { StatusBar } from "@/components/explorer/StatusBar"
import { FileActionsBar } from "@/components/explorer/FileActionsBar"
import { DateSyncModal } from "@/components/explorer/DateSyncModal"
import { DateDifferenceModal } from "@/components/explorer/DateDifferenceModal"
import { SettingsModal } from "@/components/explorer/SettingsModal"
import { FileItem, ViewMode } from "@/types/explorer"
import { useSettings } from "@/hooks/useSettings"

export default function Home() {
  const { settings, loading: settingsLoading, setSetting } = useSettings()

  const [currentPath, setCurrentPath] = useState<string>("")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false)
  const [dateSyncModalOpen, setDateSyncModalOpen] = useState(false)
  const [dateDifferenceModalOpen, setDateDifferenceModalOpen] = useState(false)
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [syncProgress, setSyncProgress] = useState({
    isProcessing: false,
    processedCount: 0,
    successCount: 0,
    failureCount: 0,
  })

  // Initialize with settings when loaded
  useEffect(() => {
    if (!settingsLoading && settings) {
      // Load saved view mode
      if (settings.viewMode) {
        setViewMode(settings.viewMode)
      }

      // Initialize path
      initializePath()
    }
  }, [settingsLoading, settings])

  const initializePath = async () => {
    try {
      // Try to use saved last path first
      if (settings?.lastPath) {
        const pathInfo = await window.electronAPI.fileSystem.getPathInfo(settings.lastPath)
        if (pathInfo.exists && pathInfo.isDirectory) {
          navigateToPath(settings.lastPath)
          return
        }
      }

      // Fall back to first drive
      const drives = await window.electronAPI.fileSystem.getDrives()
      if (drives.length > 0) {
        navigateToPath(drives[0].path)
      }
    } catch (error) {
      console.error("Failed to initialize path:", error)
    }
  }

  // Load files when path changes
  useEffect(() => {
    if (currentPath) {
      loadFiles()
    }
  }, [currentPath])

  const loadFiles = async () => {
    try {
      // Don't attempt to load if path is empty
      if (!currentPath || currentPath.trim() === "") {
        setFiles([])
        return
      }

      const items = await window.electronAPI.fileSystem.readDirectory(currentPath)
      setFiles(items)
    } catch (error) {
      console.error("Failed to load files:", error)
      setFiles([])
    }
  }

  const navigateToPath = (path: string) => {
    if (path === currentPath) return

    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(path)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)

    setCurrentPath(path)
    setSelectedFiles([])
    setSelectedFile(null)

    // Save last path to settings
    setSetting("lastPath", path)
  }

  // Handle view mode changes
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode)
    setSetting("viewMode", mode)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setCurrentPath(history[newIndex])
      setSelectedFiles([])
    }
  }

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setCurrentPath(history[newIndex])
      setSelectedFiles([])
    }
  }

  const goUp = () => {
    const segments = currentPath.split(/[\\/]/).filter(Boolean)
    if (segments.length > 1) {
      segments.pop()
      // Detect Windows path by checking for drive letter pattern
      const isWindowsPath = segments.length > 0 && /^[A-Za-z]:?$/.test(segments[0])
      const parentPath = isWindowsPath
        ? segments.join("\\") + (segments.length === 1 ? "\\" : "")
        : "/" + segments.join("/")
      navigateToPath(parentPath)
    }
  }

  const refresh = () => {
    loadFiles()
  }

  // Check if any selected files have encoded dates
  const hasFilesWithEncodedDates = () => {
    if (selectedFiles.length === 0) return false
    return selectedFiles.some((filePath) => {
      const file = files.find((f) => f.path === filePath)
      return file && file.encodedDate
    })
  }

  const handleSelectDateDifferences = (options: {
    checkCreationDate: boolean
    checkModifiedDate: boolean
    maxDifferenceInDays: number
  }) => {
    // Filter files that have encoded dates and meet the criteria
    const filesToSelect = files.filter((file) => {
      if (!file.encodedDate) return false

      const encodedTime = new Date(file.encodedDate).getTime()
      const maxDiffMs = options.maxDifferenceInDays * 24 * 60 * 60 * 1000

      let meetsCreationCriteria = false
      let meetsModifiedCriteria = false

      if (options.checkCreationDate && file.created) {
        const createdTime = new Date(file.created).getTime()
        const creationDiff = Math.abs(encodedTime - createdTime)
        meetsCreationCriteria = creationDiff > maxDiffMs
      }

      if (options.checkModifiedDate && file.modified) {
        const modifiedTime = new Date(file.modified).getTime()
        const modifiedDiff = Math.abs(encodedTime - modifiedTime)
        meetsModifiedCriteria = modifiedDiff > maxDiffMs
      }

      // Return true if any of the checked criteria are met
      if (options.checkCreationDate && options.checkModifiedDate) {
        return meetsCreationCriteria || meetsModifiedCriteria
      } else if (options.checkCreationDate) {
        return meetsCreationCriteria
      } else if (options.checkModifiedDate) {
        return meetsModifiedCriteria
      }

      return false
    })

    // Enable multiselect mode and select the matching files
    setIsMultiSelectMode(true)
    setSelectedFiles(filesToSelect.map((f) => f.path))

    console.log(`Selected ${filesToSelect.length} files with date differences`)
  }

  const handleSyncDates = async (options: {
    setCreationDate: boolean
    setModifiedDate: boolean
  }) => {
    // Get selected files that have encoded dates
    const filesToSync = selectedFiles
      .map((filePath) => files.find((f) => f.path === filePath))
      .filter(
        (file): file is FileItem =>
          file !== undefined && file.encodedDate !== null && file.encodedDate !== undefined
      )

    if (filesToSync.length === 0) return

    // Reset and start progress
    setSyncProgress({
      isProcessing: true,
      processedCount: 0,
      successCount: 0,
      failureCount: 0,
    })

    try {
      // Process files in batches to show progress
      const batchSize = 5
      let allResults: Array<{ path: string; success: boolean; error?: string }> = []

      for (let i = 0; i < filesToSync.length; i += batchSize) {
        const batch = filesToSync.slice(i, i + batchSize)
        const batchResults = await window.electronAPI.fileSystem.setFileDates(batch, options)
        allResults = [...allResults, ...batchResults]

        // Update progress
        const processed = Math.min(i + batchSize, filesToSync.length)
        const successSoFar = allResults.filter((r: { success: boolean }) => r.success).length
        const failureSoFar = allResults.filter((r: { success: boolean }) => !r.success).length

        setSyncProgress({
          isProcessing: true,
          processedCount: processed,
          successCount: successSoFar,
          failureCount: failureSoFar,
        })

        // Small delay to show progress
        if (i + batchSize < filesToSync.length) {
          await new Promise((resolve) => setTimeout(resolve, 100))
        }
      }

      // Final results
      const finalSuccess = allResults.filter((r: { success: boolean }) => r.success).length
      const finalFailure = allResults.filter((r: { success: boolean }) => !r.success).length

      if (finalFailure > 0) {
        const failures = allResults.filter((r: { success: boolean }) => !r.success)
        console.error(`Failed to update ${finalFailure} files:`)
        failures.forEach((f: { path: string; error?: string }) => {
          console.error(`  - ${f.path}: ${f.error}`)
        })
      }

      // Mark as complete
      setSyncProgress({
        isProcessing: true,
        processedCount: filesToSync.length,
        successCount: finalSuccess,
        failureCount: finalFailure,
      })

      if (finalSuccess > 0) {
        console.log(`Successfully updated ${finalSuccess} files`)
        // Save current selection
        const currentSelection = [...selectedFiles]

        // Force refresh the file list to show updated dates
        setTimeout(() => {
          setRefreshKey((prev) => prev + 1)
          // Restore selection after component remounts
          setTimeout(() => {
            setSelectedFiles(currentSelection)
          }, 50)
        }, 1000) // Wait a bit before refreshing
      }
    } catch (error) {
      console.error("Error syncing dates:", error)
      setSyncProgress((prev) => ({ ...prev, isProcessing: false }))
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen flex-col bg-background text-foreground">
        {/* Toolbar */}
        <Toolbar
          currentPath={currentPath}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onNavigate={navigateToPath}
          onBack={goBack}
          onForward={goForward}
          onUp={goUp}
          onRefresh={refresh}
          onSettingsClick={() => setSettingsModalOpen(true)}
          canGoBack={historyIndex > 0}
          canGoForward={historyIndex < history.length - 1}
        />

        {/* File Actions Bar */}
        <FileActionsBar
          isMultiSelectMode={isMultiSelectMode}
          onMultiSelectToggle={() => {
            setIsMultiSelectMode(!isMultiSelectMode)
            if (isMultiSelectMode) {
              // Clear selection when exiting multiselect mode
              setSelectedFiles([])
            }
          }}
          selectedCount={selectedFiles.length}
          hasFilesWithEncodedDates={hasFilesWithEncodedDates()}
          onSyncDates={() => setDateSyncModalOpen(true)}
          onSelectDateDifferences={() => setDateDifferenceModalOpen(true)}
        />

        {/* Drives Bar (below file actions) */}
        <DrivesBar onDriveSelect={navigateToPath} selectedPath={currentPath} />

        {/* Main content */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar */}
          <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
            <div className="h-full bg-card">
              <ScrollArea className="h-full">
                {/* Directory Tree */}
                {currentPath && currentPath.trim() !== "" && (
                  <DirectoryTree
                    rootPath={(() => {
                      const segments = currentPath.split(/[\\/]/).filter(Boolean)
                      if (segments.length === 0) return ""
                      const firstSegment = segments[0]
                      // Check if it's a Windows drive letter
                      const isWindowsPath = /^[A-Za-z]:?$/.test(firstSegment)
                      return firstSegment + (isWindowsPath ? "\\" : "/")
                    })()}
                    selectedPath={currentPath}
                    onPathSelect={navigateToPath}
                  />
                )}
              </ScrollArea>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Files area */}
          <ResizablePanel defaultSize={75}>
            <div className="flex h-full flex-col bg-background">
              <FilesList
                key={refreshKey}
                path={currentPath}
                viewMode={viewMode}
                onFileSelect={setSelectedFile}
                onDirectoryOpen={navigateToPath}
                selectedFiles={selectedFiles}
                onSelectionChange={setSelectedFiles}
                isMultiSelectMode={isMultiSelectMode}
                files={files}
                onFilesUpdate={setFiles}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Status Bar */}
        <StatusBar files={files} selectedCount={selectedFiles.length} currentPath={currentPath} />

        {/* Date Sync Modal */}
        <DateSyncModal
          open={dateSyncModalOpen}
          onOpenChange={(open) => {
            setDateSyncModalOpen(open)
            if (!open) {
              // Reset progress when closing
              setSyncProgress({
                isProcessing: false,
                processedCount: 0,
                successCount: 0,
                failureCount: 0,
              })
            }
          }}
          selectedCount={selectedFiles.length}
          onConfirm={handleSyncDates}
          isProcessing={syncProgress.isProcessing}
          processedCount={syncProgress.processedCount}
          successCount={syncProgress.successCount}
          failureCount={syncProgress.failureCount}
        />

        {/* Date Difference Modal */}
        <DateDifferenceModal
          open={dateDifferenceModalOpen}
          onOpenChange={setDateDifferenceModalOpen}
          onConfirm={handleSelectDateDifferences}
        />

        {/* Settings Modal */}
        <SettingsModal open={settingsModalOpen} onOpenChange={setSettingsModalOpen} />
      </div>
    </ErrorBoundary>
  )
}
