"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Monitor, Calendar, FolderOpen } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"
import { ViewMode } from "@/types/explorer"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings, setSetting } = useSettings()
  
  // Local state for form values
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sidebarWidth, setSidebarWidth] = useState(250)
  const [dateSyncCreation, setDateSyncCreation] = useState(true)
  const [dateSyncModified, setDateSyncModified] = useState(true)
  const [dateDiffCreation, setDateDiffCreation] = useState(true)
  const [dateDiffModified, setDateDiffModified] = useState(true)
  const [dateDiffMaxDays, setDateDiffMaxDays] = useState(7)
  
  // Load settings when modal opens
  useEffect(() => {
    if (open && settings) {
      setViewMode(settings.viewMode || "grid")
      setSidebarWidth(settings.sidebarWidth || 250)
      setDateSyncCreation(settings.dateSyncDefaults?.setCreationDate ?? true)
      setDateSyncModified(settings.dateSyncDefaults?.setModifiedDate ?? true)
      setDateDiffCreation(settings.dateDifferenceDefaults?.checkCreationDate ?? true)
      setDateDiffModified(settings.dateDifferenceDefaults?.checkModifiedDate ?? true)
      setDateDiffMaxDays(settings.dateDifferenceDefaults?.maxDifferenceInDays || 7)
    }
  }, [open, settings])
  
  const handleSave = () => {
    // Save all settings
    setSetting("viewMode", viewMode)
    setSetting("sidebarWidth", sidebarWidth)
    setSetting("dateSyncDefaults", {
      setCreationDate: dateSyncCreation,
      setModifiedDate: dateSyncModified,
    })
    setSetting("dateDifferenceDefaults", {
      checkCreationDate: dateDiffCreation,
      checkModifiedDate: dateDiffModified,
      maxDifferenceInDays: dateDiffMaxDays,
    })
    
    onOpenChange(false)
  }
  
  const handleCancel = () => {
    // Reset to current settings
    if (settings) {
      setViewMode(settings.viewMode || "grid")
      setSidebarWidth(settings.sidebarWidth || 250)
      setDateSyncCreation(settings.dateSyncDefaults?.setCreationDate ?? true)
      setDateSyncModified(settings.dateSyncDefaults?.setModifiedDate ?? true)
      setDateDiffCreation(settings.dateDifferenceDefaults?.checkCreationDate ?? true)
      setDateDiffModified(settings.dateDifferenceDefaults?.checkModifiedDate ?? true)
      setDateDiffMaxDays(settings.dateDifferenceDefaults?.maxDifferenceInDays || 7)
    }
    onOpenChange(false)
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Configure your application preferences
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {/* View Preferences */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                View Preferences
              </h3>
              
              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="viewMode">Default View Mode</Label>
                  <select
                    id="viewMode"
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value as ViewMode)}
                    className="w-32 h-9 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="grid">Grid</option>
                    <option value="list">List</option>
                    <option value="details">Details</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="sidebarWidth">Sidebar Width (px)</Label>
                  <Input
                    id="sidebarWidth"
                    type="number"
                    min="150"
                    max="500"
                    value={sidebarWidth}
                    onChange={(e) => setSidebarWidth(parseInt(e.target.value) || 250)}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Date Sync Defaults */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Sync Defaults
              </h3>
              
              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dateSyncCreation">Set Creation Date</Label>
                  <Switch
                    id="dateSyncCreation"
                    checked={dateSyncCreation}
                    onCheckedChange={setDateSyncCreation}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="dateSyncModified">Set Modified Date</Label>
                  <Switch
                    id="dateSyncModified"
                    checked={dateSyncModified}
                    onCheckedChange={setDateSyncModified}
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Date Difference Defaults */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date Difference Selection Defaults
              </h3>
              
              <div className="space-y-3 pl-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dateDiffCreation">Check Creation Date</Label>
                  <Switch
                    id="dateDiffCreation"
                    checked={dateDiffCreation}
                    onCheckedChange={setDateDiffCreation}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="dateDiffModified">Check Modified Date</Label>
                  <Switch
                    id="dateDiffModified"
                    checked={dateDiffModified}
                    onCheckedChange={setDateDiffModified}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="dateDiffMaxDays">Max Difference (days)</Label>
                  <Input
                    id="dateDiffMaxDays"
                    type="number"
                    min="1"
                    max="365"
                    value={dateDiffMaxDays}
                    onChange={(e) => setDateDiffMaxDays(parseInt(e.target.value) || 7)}
                    className="w-32"
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Current Session Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <FolderOpen className="h-4 w-4" />
                Current Session
              </h3>
              
              <div className="space-y-2 pl-6">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Last Path:</span>{" "}
                  {settings?.lastPath || "Not set"}
                </div>
                {settings?.windowBounds && (
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Window Size:</span>{" "}
                    {settings.windowBounds.width} × {settings.windowBounds.height}
                    {settings.windowBounds.x !== undefined && settings.windowBounds.y !== undefined && (
                      <span> at ({settings.windowBounds.x}, {settings.windowBounds.y})</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}