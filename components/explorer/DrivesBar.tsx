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
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDrives()
  }, [])

  const withTimeout = <T,>(p: Promise<T>, ms: number): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const id = setTimeout(() => reject(new Error('timeout')), ms)
      p.then((val) => {
        clearTimeout(id)
        resolve(val)
      }).catch((err) => {
        clearTimeout(id)
        reject(err)
      })
    })
  }

  const loadDrives = async () => {
    try {
      setLoading(true)
      setError(null)
      const drivesList = await withTimeout(window.electronAPI.fileSystem.getDrives(), 8000)
      setDrives(drivesList)
    } catch (error) {
      console.error("Failed to load drives:", error)
      setError('Failed to load drives')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-b border-border bg-card px-3 py-2">
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading drives...</div>
      ) : error ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Couldn’t load drives.</span>
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={loadDrives}>Retry</Button>
        </div>
      ) : drives.length === 0 ? (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">No drives found.</span>
          <Button variant="ghost" size="sm" className="h-7 px-2" onClick={loadDrives}>Refresh</Button>
        </div>
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
