'use client'

import { useState, useEffect } from 'react'
import { FileItem, ViewMode } from '@/types/explorer'
import { getFileIcon, getFileIconColor, formatFileSize, formatDate } from '@/lib/fileUtils'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

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
  onSelectionChange
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
      setFiles(items)
    } catch (err) {
      console.error('Failed to load files:', err)
      setError('Failed to load directory')
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
          ? selectedFiles.filter(p => p !== item.path)
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
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  if (viewMode === 'grid') {
    return (
      <ScrollArea className="h-full">
        <div className="grid grid-cols-4 gap-4 p-4 lg:grid-cols-6 xl:grid-cols-8">
          {files.map(file => {
            const Icon = getFileIcon(file.extension, file.isDirectory, file.mediaType)
            const iconColor = getFileIconColor(file.mediaType)
            const isSelected = selectedFiles.includes(file.path)

            return (
              <div
                key={file.path}
                className={cn(
                  "flex cursor-pointer flex-col items-center rounded-lg p-2",
                  "hover:bg-gray-700",
                  isSelected && "bg-gray-700 ring-2 ring-blue-500"
                )}
                onClick={(e) => handleItemClick(file, e)}
              >
                <Icon className={cn("mb-2 h-12 w-12", iconColor)} />
                <span className="text-center text-xs text-gray-300 line-clamp-2">
                  {file.name}
                </span>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    )
  }

  if (viewMode === 'list') {
    return (
      <ScrollArea className="h-full">
        <div className="space-y-1 p-2">
          {files.map(file => {
            const Icon = getFileIcon(file.extension, file.isDirectory, file.mediaType)
            const iconColor = getFileIconColor(file.mediaType)
            const isSelected = selectedFiles.includes(file.path)

            return (
              <div
                key={file.path}
                className={cn(
                  "flex cursor-pointer items-center gap-2 rounded px-2 py-1",
                  "hover:bg-gray-700",
                  isSelected && "bg-gray-700 ring-1 ring-blue-500"
                )}
                onClick={(e) => handleItemClick(file, e)}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0", iconColor)} />
                <span className="flex-1 truncate text-sm text-gray-300">
                  {file.name}
                </span>
                {!file.isDirectory && (
                  <span className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </span>
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
        <thead className="sticky top-0 bg-gray-800 border-b border-gray-700">
          <tr className="text-left text-xs text-gray-400">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Size</th>
            <th className="px-4 py-2">Modified</th>
          </tr>
        </thead>
        <tbody>
          {files.map(file => {
            const Icon = getFileIcon(file.extension, file.isDirectory, file.mediaType)
            const iconColor = getFileIconColor(file.mediaType)
            const isSelected = selectedFiles.includes(file.path)

            return (
              <tr
                key={file.path}
                className={cn(
                  "cursor-pointer border-b border-gray-800",
                  "hover:bg-gray-700",
                  isSelected && "bg-gray-700"
                )}
                onClick={(e) => handleItemClick(file, e)}
              >
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-4 w-4", iconColor)} />
                    <span className="text-sm text-gray-300">{file.name}</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-gray-400">
                  {file.isDirectory ? 'Folder' : file.mediaType || 'File'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-400">
                  {file.isDirectory ? '-' : formatFileSize(file.size)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-400">
                  {formatDate(file.modified)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </ScrollArea>
  )
}