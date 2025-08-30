"use client"

import { useState, useEffect } from "react"
import { FileItem, ViewMode } from "@/types/explorer"
import {
  getFileIcon,
  getFileIconColor,
  formatFileSize,
  formatDateTime,
  truncateFilename,
} from "@/lib/fileUtils"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2, CornerLeftUp } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { VirtualizedFilesList } from "./VirtualizedFilesList"

interface FilesListProps {
  path: string
  viewMode: ViewMode
  onFileSelect: (file: FileItem) => void
  onDirectoryOpen: (path: string) => void
  selectedFiles: string[]
  onSelectionChange: (files: string[]) => void
  isMultiSelectMode?: boolean
  onFilesUpdate?: (files: FileItem[]) => void
  searchQuery?: string
}

export function FilesList({
  path,
  viewMode,
  onFileSelect,
  onDirectoryOpen,
  selectedFiles,
  onSelectionChange,
  isMultiSelectMode = false,
  onFilesUpdate,
  searchQuery,
}: FilesListProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingEncodedDates, setLoadingEncodedDates] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shouldUpdateParent, setShouldUpdateParent] = useState(false)

  // Filter files based on search query
  const filteredFiles = files.filter((file) => {
    if (!searchQuery || searchQuery.trim() === "") {
      return true
    }

    const query = searchQuery.toLowerCase().trim()
    const fileName = file.name.toLowerCase()
    const fileExtension = file.extension.toLowerCase()

    // Search in filename, extension, and media type
    return (
      fileName.includes(query) ||
      fileExtension.includes(query) ||
      (file.mediaType && file.mediaType.toLowerCase().includes(query))
    )
  })

  // Helper function to check if we're in a subdirectory (not at root)
  const isInSubdirectory = () => {
    if (!path) return false

    // Check for Windows drive root (e.g., "C:\")
    if (/^[A-Za-z]:\\?$/.test(path)) return false

    // Check for Unix root
    if (path === "/") return false

    return true
  }

  // Helper function to get parent directory path
  const getParentPath = () => {
    const segments = path.split(/[\\/]/).filter(Boolean)
    if (segments.length <= 1) return path // Already at root

    segments.pop()
    const isWindowsPath = /^[A-Za-z]:?$/.test(segments[0])
    return isWindowsPath
      ? segments.join("\\") + (segments.length === 1 ? "\\" : "")
      : "/" + segments.join("/")
  }

  useEffect(() => {
    loadFiles()
  }, [path])

  // Notify parent when files are updated
  useEffect(() => {
    if (shouldUpdateParent && onFilesUpdate) {
      const filteredFiles = files.filter((f) => f.name !== "..")
      onFilesUpdate(filteredFiles)
      setShouldUpdateParent(false)
    }
  }, [files, shouldUpdateParent, onFilesUpdate])

  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await window.electronAPI.fileSystem.readDirectory(path)

      // Add parent directory entry if we're in a subdirectory
      let displayItems = [...items]
      if (isInSubdirectory()) {
        const parentEntry: FileItem = {
          name: "..",
          path: getParentPath(),
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

      // Mark that parent should be updated
      if (onFilesUpdate) {
        setShouldUpdateParent(true)
      }

      // Load encoded dates asynchronously after displaying the table
      loadEncodedDates(items)
    } catch (err) {
      console.error("Failed to load files:", err)
      setError("Failed to load directory")
    } finally {
      setLoading(false)
    }
  }

  const loadEncodedDates = async (items: FileItem[]) => {
    // Only process media files
    const mediaFiles = items.filter(
      (item) =>
        item.mediaType === "video" || item.mediaType === "audio" || item.mediaType === "image"
    )

    if (mediaFiles.length === 0) return

    try {
      setLoadingEncodedDates(true)
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

      // Mark that parent should be updated
      if (onFilesUpdate) {
        setShouldUpdateParent(true)
      }
    } catch (err) {
      console.error("Failed to load encoded dates:", err)
      // Don't show error to user, just silently fail for encoded dates
    } finally {
      setLoadingEncodedDates(false)
    }
  }

  const handleItemClick = (item: FileItem, e: React.MouseEvent) => {
    if (e.detail === 2) {
      // Double click
      if (item.isDirectory) {
        onDirectoryOpen(item.path)
      } else {
        window.electronAPI.fileSystem.openFile(item.path)
      }
    } else {
      // Single click
      if (isMultiSelectMode) {
        // In multiselect mode, clicking toggles selection
        toggleSelection(item.path)
      } else if (e.ctrlKey || e.metaKey) {
        // Multi-select with ctrl/cmd
        const newSelection = selectedFiles.includes(item.path)
          ? selectedFiles.filter((p) => p !== item.path)
          : [...selectedFiles, item.path]
        onSelectionChange(newSelection)
      } else {
        // Single select
        onSelectionChange([item.path])
        onFileSelect(item)
      }
    }
  }

  const toggleSelection = (filePath: string) => {
    const newSelection = selectedFiles.includes(filePath)
      ? selectedFiles.filter((p) => p !== filePath)
      : [...selectedFiles, filePath]
    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    const selectableFiles = filteredFiles.filter((f) => f.name !== "..")
    const allSelectablePaths = selectableFiles.map((f) => f.path)

    // Check if all selectable files are currently selected
    const allSelected =
      selectableFiles.length > 0 && selectableFiles.every((f) => selectedFiles.includes(f.path))

    if (allSelected) {
      // If all selected, deselect all
      onSelectionChange([])
    } else {
      // Select all files (excluding ".." parent entry)
      onSelectionChange(allSelectablePaths)
    }
  }

  const isAllSelected =
    filteredFiles.length > 0 &&
    filteredFiles.filter((f) => f.name !== "..").every((f) => selectedFiles.includes(f.path))
  const isIndeterminate = selectedFiles.length > 0 && !isAllSelected

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  // Use virtualization for large lists
  if (filteredFiles.length > 100) {
    return (
      <VirtualizedFilesList
        path={path}
        viewMode={viewMode}
        onFileSelect={onFileSelect}
        onDirectoryOpen={onDirectoryOpen}
        selectedFiles={selectedFiles}
        onSelectionChange={onSelectionChange}
        isMultiSelectMode={isMultiSelectMode}
        files={filteredFiles}
        onFilesUpdate={onFilesUpdate}
        searchQuery={searchQuery}
        height={600}
        loadingEncodedDates={loadingEncodedDates}
      />
    )
  }

  if (viewMode === "grid") {
    return (
      <ScrollArea className="h-full">
        <div className="grid grid-cols-4 gap-4 p-4 lg:grid-cols-6 xl:grid-cols-8">
          {filteredFiles.map((file) => {
            const isParentDir = file.name === ".."
            const Icon = isParentDir
              ? CornerLeftUp
              : getFileIcon(file.extension, file.isDirectory, file.mediaType, file.name)
            const iconColor = isParentDir
              ? "text-muted-foreground"
              : getFileIconColor(file.mediaType, file.extension, file.isDirectory, file.name)
            const isSelected = selectedFiles.includes(file.path)

            return (
              <div
                key={file.path}
                className={cn(
                  "relative flex cursor-pointer flex-col items-center rounded-lg p-2 select-none",
                  "hover:bg-muted",
                  isSelected && "bg-muted ring-2 ring-primary"
                )}
                onClick={(e) => handleItemClick(file, e)}
              >
                {isMultiSelectMode && file.name !== ".." && (
                  <div className="absolute top-1 left-1 z-10">
                    <Checkbox
                      checked={selectedFiles.includes(file.path)}
                      onCheckedChange={() => toggleSelection(file.path)}
                      className="bg-background/80 backdrop-blur-sm rounded"
                    />
                  </div>
                )}
                <Icon className={cn("mb-2 h-12 w-12", iconColor)} />
                {(() => {
                  if (isParentDir) {
                    return (
                      <TooltipProvider>
                        <Tooltip delayDuration={500}>
                          <TooltipTrigger asChild>
                            <span className="text-center text-xs text-foreground block max-w-full">
                              ..
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Go to parent directory</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  }
                  const { display, needsTooltip } = truncateFilename(file.name, 20)
                  return (
                    <TooltipProvider>
                      <Tooltip delayDuration={500}>
                        <TooltipTrigger asChild>
                          <span className="text-center text-xs text-foreground block max-w-full">
                            {display}
                          </span>
                        </TooltipTrigger>
                        {needsTooltip && (
                          <TooltipContent>
                            <p className="max-w-xs break-all">{file.name}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  )
                })()}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    )
  }

  if (viewMode === "list") {
    return (
      <ScrollArea className="h-full">
        <div className="space-y-1 p-2">
          {filteredFiles.map((file) => {
            const isParentDir = file.name === ".."
            const Icon = isParentDir
              ? CornerLeftUp
              : getFileIcon(file.extension, file.isDirectory, file.mediaType, file.name)
            const iconColor = isParentDir
              ? "text-muted-foreground"
              : getFileIconColor(file.mediaType, file.extension, file.isDirectory, file.name)
            const isSelected = selectedFiles.includes(file.path)

            return (
              <div
                key={file.path}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded px-2 py-1 select-none",
                  "hover:bg-muted",
                  isSelected && "bg-muted ring-1 ring-primary"
                )}
                onClick={(e) => handleItemClick(file, e)}
              >
                {isMultiSelectMode && file.name !== ".." && (
                  <Checkbox
                    checked={selectedFiles.includes(file.path)}
                    onCheckedChange={() => toggleSelection(file.path)}
                    className="mr-2"
                  />
                )}
                <Icon className={cn("h-4 w-4 flex-shrink-0", iconColor)} />
                {(() => {
                  if (isParentDir) {
                    return (
                      <TooltipProvider>
                        <Tooltip delayDuration={500}>
                          <TooltipTrigger asChild>
                            <span className="flex-1 text-sm text-foreground">..</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Go to parent directory</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  }
                  const { display, needsTooltip } = truncateFilename(file.name, 40)
                  return (
                    <TooltipProvider>
                      <Tooltip delayDuration={500}>
                        <TooltipTrigger asChild>
                          <span className="flex-1 text-sm text-foreground">{display}</span>
                        </TooltipTrigger>
                        {needsTooltip && (
                          <TooltipContent>
                            <p className="max-w-md break-all">{file.name}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  )
                })()}
                {!file.isDirectory && !isParentDir && (
                  <span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
                )}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    )
  }

  // Details view
  return (
    <ScrollArea className="h-full">
      <table className="w-full">
        <thead className="sticky top-0 bg-card border-b border-border">
          <tr className="text-left text-xs text-muted-foreground">
            {isMultiSelectMode && (
              <th className="px-4 py-2 w-10">
                <Checkbox
                  checked={isAllSelected ? true : isIndeterminate ? "indeterminate" : false}
                  onCheckedChange={handleSelectAll}
                />
              </th>
            )}
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Size</th>
            <th className="px-4 py-2">Date Created</th>
            <th className="px-4 py-2">Date Modified</th>
            <th className="px-4 py-2">Encoded Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredFiles.map((file) => {
            const isParentDir = file.name === ".."
            const Icon = isParentDir
              ? CornerLeftUp
              : getFileIcon(file.extension, file.isDirectory, file.mediaType, file.name)
            const iconColor = isParentDir
              ? "text-muted-foreground"
              : getFileIconColor(file.mediaType, file.extension, file.isDirectory, file.name)
            const isSelected = selectedFiles.includes(file.path)

            return (
              <tr
                key={file.path}
                className={cn(
                  "cursor-pointer border-b border-border select-none",
                  "hover:bg-muted",
                  isSelected && "bg-muted"
                )}
                onClick={(e) => handleItemClick(file, e)}
              >
                {isMultiSelectMode && (
                  <td className="px-4 py-2">
                    {file.name !== ".." && (
                      <Checkbox
                        checked={selectedFiles.includes(file.path)}
                        onCheckedChange={() => toggleSelection(file.path)}
                      />
                    )}
                  </td>
                )}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={cn("h-4 w-4 flex-shrink-0", iconColor)} />
                    {(() => {
                      if (isParentDir) {
                        return (
                          <TooltipProvider>
                            <Tooltip delayDuration={500}>
                              <TooltipTrigger asChild>
                                <span className="text-sm text-foreground">..</span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Go to parent directory</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )
                      }
                      const { display, needsTooltip } = truncateFilename(file.name, 50)
                      return (
                        <TooltipProvider>
                          <Tooltip delayDuration={500}>
                            <TooltipTrigger asChild>
                              <span className="text-sm text-foreground">{display}</span>
                            </TooltipTrigger>
                            {needsTooltip && (
                              <TooltipContent>
                                <p className="max-w-md break-all">{file.name}</p>
                              </TooltipContent>
                            )}
                          </Tooltip>
                        </TooltipProvider>
                      )
                    })()}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {isParentDir
                    ? "Parent Directory"
                    : file.isDirectory
                    ? "Folder"
                    : file.mediaType || "File"}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {isParentDir || file.isDirectory ? "-" : formatFileSize(file.size)}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {isParentDir ? "-" : formatDateTime(file.created)}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {isParentDir ? "-" : formatDateTime(file.modified)}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {isParentDir ? (
                    "-"
                  ) : file.encodedDate ? (
                    formatDateTime(file.encodedDate)
                  ) : loadingEncodedDates &&
                    (file.mediaType === "video" ||
                      file.mediaType === "audio" ||
                      file.mediaType === "image") ? (
                    <span className="text-xs">Loading...</span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </ScrollArea>
  )
}
