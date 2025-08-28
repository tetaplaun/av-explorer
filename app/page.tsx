"use client"

import { useState, useEffect } from "react"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DrivesBar } from "@/components/explorer/DrivesBar"
import { DirectoryTree } from "@/components/explorer/DirectoryTree"
import { FilesList } from "@/components/explorer/FilesList"
import { Toolbar } from "@/components/explorer/Toolbar"
import { StatusBar } from "@/components/explorer/StatusBar"
import { FileItem, ViewMode } from "@/types/explorer"

export default function Home() {
  const [currentPath, setCurrentPath] = useState<string>("")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  // Initialize with first drive on mount
  useEffect(() => {
    initializePath()
  }, [])

  const initializePath = async () => {
    try {
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

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Toolbar */}
      <Toolbar
        currentPath={currentPath}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onNavigate={navigateToPath}
        onBack={goBack}
        onForward={goForward}
        onUp={goUp}
        onRefresh={refresh}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
      />

      {/* Drives Bar (below toolbar) */}
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
              path={currentPath}
              viewMode={viewMode}
              onFileSelect={setSelectedFile}
              onDirectoryOpen={navigateToPath}
              selectedFiles={selectedFiles}
              onSelectionChange={setSelectedFiles}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Status Bar */}
      <StatusBar files={files} selectedCount={selectedFiles.length} currentPath={currentPath} />
    </div>
  )
}
