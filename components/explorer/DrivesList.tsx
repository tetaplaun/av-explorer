"use client"

import { useEffect, useState } from "react"
import { HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatFileSize } from "@/lib/fileUtils"
import { DriveInfo } from "@/types/explorer"

interface DrivesListProps {
  onDriveSelect: (path: string) => void
  selectedPath: string
}

export function DrivesList({ onDriveSelect, selectedPath }: DrivesListProps) {
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

  if (loading) {
    return <div className="p-4 text-muted-foreground">Loading drives...</div>
  }

  return (
    <div className="space-y-1 p-2">
      <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Drives</h3>
      {drives.map((drive) => {
        const isSelected = selectedPath.startsWith(drive.path)
        const usedSpace = drive.totalSize && drive.freeSpace ? drive.totalSize - drive.freeSpace : 0

        return (
          <Button
            key={drive.path}
            variant={isSelected ? "secondary" : "ghost"}
            className="w-full justify-start px-2 py-1 h-auto"
            onClick={() => onDriveSelect(drive.path)}
          >
            <div className="flex w-full items-center gap-2">
              <HardDrive className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 text-left">
                <div className="text-sm text-foreground">{drive.name}</div>
                {drive.totalSize && (
                  <div className="text-xs text-muted-foreground">
                    {formatFileSize(usedSpace)} / {formatFileSize(drive.totalSize)}
                  </div>
                )}
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}
