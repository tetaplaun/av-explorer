"use client"

import { useState, useEffect } from "react"
import { FileItem, ViewMode } from "@/types/explorer"
import { getFileIcon, getFileIconColor, formatFileSize, formatDate, formatDateTime, truncateFilename } from "@/lib/fileUtils"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Loader2 } from "lucide-react"

interface FilesListProps {
  path: string
  viewMode: ViewMode
  onFileSelect: (file: FileItem) => void
  onDirectoryOpen: (path: string) => void
  selectedFiles: string[]
  onSelectionChange: (files: string[]) => void
}

export function FilesList({
  path,
  viewMode,
  onFileSelect,
  onDirectoryOpen,
  selectedFiles,
  onSelectionChange,
}: FilesListProps) {
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadFiles()
  }, [path])

  const loadFiles = async () => {
    try {
      setLoading(true)
      setError(null)
      const items = await window.electronAPI.fileSystem.readDirectory(path)
      // Debug: Check if created dates are being received
      if (items.length > 0) {
        console.log("Sample file data:", items[0])
      }
      setFiles(items)
    } catch (err) {
      console.error("Failed to load files:", err)
      setError("Failed to load directory")
    } finally {
      setLoading(false)
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
      if (e.ctrlKey || e.metaKey) {
        // Multi-select
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

  if (viewMode === "grid") {
    return (
      <ScrollArea className="h-full">
        <div className="grid grid-cols-4 gap-4 p-4 lg:grid-cols-6 xl:grid-cols-8">
          {files.map((file) => {
            const Icon = getFileIcon(file.extension, file.isDirectory, file.mediaType, file.name)
            const iconColor = getFileIconColor(file.mediaType, file.extension, file.isDirectory, file.name)
            const isSelected = selectedFiles.includes(file.path)

            return (
              <div
                key={file.path}
                className={cn(
                  "flex cursor-pointer flex-col items-center rounded-lg p-2",
                  "hover:bg-muted",
                  isSelected && "bg-muted ring-2 ring-primary"
                )}
                onClick={(e) => handleItemClick(file, e)}
              >
                <Icon className={cn("mb-2 h-12 w-12", iconColor)} />
                {(() => {
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
          {files.map((file) => {
            const Icon = getFileIcon(file.extension, file.isDirectory, file.mediaType, file.name)
            const iconColor = getFileIconColor(file.mediaType, file.extension, file.isDirectory, file.name)
            const isSelected = selectedFiles.includes(file.path)

            return (
              <div
                key={file.path}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded px-2 py-1",
                  "hover:bg-muted",
                  isSelected && "bg-muted ring-1 ring-primary"
                )}
                onClick={(e) => handleItemClick(file, e)}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", iconColor)} />
                {(() => {
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
                {!file.isDirectory && (
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
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Size</th>
            <th className="px-4 py-2">Date Created</th>
            <th className="px-4 py-2">Date Modified</th>
            <th className="px-4 py-2">Encoded Date</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => {
            const Icon = getFileIcon(file.extension, file.isDirectory, file.mediaType, file.name)
            const iconColor = getFileIconColor(file.mediaType, file.extension, file.isDirectory, file.name)
            const isSelected = selectedFiles.includes(file.path)

            return (
              <tr
                key={file.path}
                className={cn(
                  "cursor-pointer border-b border-border",
                  "hover:bg-muted",
                  isSelected && "bg-muted"
                )}
                onClick={(e) => handleItemClick(file, e)}
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={cn("h-4 w-4 flex-shrink-0", iconColor)} />
                    {(() => {
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
                  {file.isDirectory ? "Folder" : file.mediaType || "File"}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {file.isDirectory ? "-" : formatFileSize(file.size)}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {formatDateTime(file.created)}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {formatDateTime(file.modified)}
                </td>
                <td className="px-4 py-2 text-sm text-muted-foreground">
                  {file.encodedDate ? formatDateTime(file.encodedDate) : '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </ScrollArea>
  )
}
