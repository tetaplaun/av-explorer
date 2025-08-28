"use client"

import { useEffect, useState } from "react"
import { HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatFileSize } from "@/lib/fileUtils"
import type { DriveInfo } from "@/types/explorer"

interface DrivesBarProps {
  onDriveSelect: (path: string) => void
  selectedPath: string
}

export function DrivesBar({ onDriveSelect, selectedPath }: DrivesBarProps) {
  const [drives, setDrives] = useState<DriveInfo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDrives()
  }, [])

  const loadDrives = async () => {
    try {
      setLoading(true)
      const drivesList = await window.electronAPI.fileSystem.getDrives()
      setDrives(drivesList)
    } catch (error) {
      console.error("Failed to load drives:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-b border-border bg-card px-3 py-2">
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading drives...</div>
      ) : (
        <div className="flex items-center gap-2 overflow-x-auto">
          {drives.map((drive) => {
            const isSelected = selectedPath.startsWith(drive.path)
            const usedSpace = drive.totalSize && drive.freeSpace ? drive.totalSize - drive.freeSpace : 0
            const usagePercent = drive.totalSize ? Math.round((usedSpace / drive.totalSize) * 100) : undefined

            return (
              <Button
                key={drive.path}
                variant={isSelected ? "secondary" : "ghost"}
                className="h-8 whitespace-nowrap px-2"
                onClick={() => onDriveSelect(drive.path)}
                title={
                  drive.totalSize
                    ? `${drive.name} • ${formatFileSize(usedSpace)} / ${formatFileSize(drive.totalSize)}${
                        usagePercent !== undefined ? ` (${usagePercent}%)` : ""
                      }`
                    : drive.name
                }
              >
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{drive.name}</span>
                </div>
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

