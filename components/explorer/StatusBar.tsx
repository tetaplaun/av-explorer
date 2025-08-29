"use client"

import { FileItem } from "@/types/explorer"
import { formatFileSize } from "@/lib/fileUtils"
import { FileVideo, Music, Image } from "lucide-react"

interface StatusBarProps {
  files: FileItem[]
  selectedCount: number
}

export function StatusBar({ files, selectedCount }: StatusBarProps) {
  const totalFiles = files.filter((f) => !f.isDirectory).length
  const totalFolders = files.filter((f) => f.isDirectory).length

  const mediaCount = {
    video: files.filter((f) => f.mediaType === "video").length,
    audio: files.filter((f) => f.mediaType === "audio").length,
    image: files.filter((f) => f.mediaType === "image").length,
  }

  const totalSize = files.filter((f) => !f.isDirectory).reduce((sum, f) => sum + f.size, 0)

  return (
    <div className="border-t border-border bg-card px-4 py-1.5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>
            {totalFiles} files, {totalFolders} folders
          </span>
          {selectedCount > 0 && <span className="text-primary">{selectedCount} selected</span>}
        </div>

        <div className="flex items-center gap-4">
          {mediaCount.video > 0 && (
            <div className="flex items-center gap-1">
              <FileVideo className="h-3 w-3 text-purple-500" />
              <span>{mediaCount.video}</span>
            </div>
          )}
          {mediaCount.audio > 0 && (
            <div className="flex items-center gap-1">
              <Music className="h-3 w-3 text-green-500" />
              <span>{mediaCount.audio}</span>
            </div>
          )}
          {mediaCount.image > 0 && (
            <div className="flex items-center gap-1">
              <Image className="h-3 w-3 text-blue-500" />
              <span>{mediaCount.image}</span>
            </div>
          )}
          <span className="text-muted-foreground">|</span>
          <span>{formatFileSize(totalSize)}</span>
        </div>
      </div>
    </div>
  )
}
