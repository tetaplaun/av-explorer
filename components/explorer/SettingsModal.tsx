"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Settings,
  Monitor,
  Calendar,
  FolderOpen,
  Sun,
  Moon,
  Laptop,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { useSettingsForm } from "@/hooks/useSettingsForm"
import { useSettings } from "@/hooks/useSettings"
import { ViewMode } from "@/types/explorer"
import { ValidationError } from "@/lib/validation"
import {
  SettingSection,
  SettingItem,
  ToggleSetting,
  NumberSetting,
  SelectSetting,
} from "@/components/ui/setting-section"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { settings } = useSettings()
  const {
    formData,
    isDirty,
    isSubmitting,
    validationErrors,
    isValid,
    updateField,
    resetForm,
    saveChanges,
    hasChanges,
    validateForm,
    clearValidationErrors,
  } = useSettingsForm()

  const handleSave = async () => {
    try {
      await saveChanges()
      onOpenChange(false)
    } catch (error) {
      // Error is already logged in the hook
      // Could add toast notification here if desired
    }
  }

  const handleCancel = () => {
    resetForm()
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
          <DialogDescription>Configure your application preferences</DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-6">
          <div className="space-y-6 pr-2">
            {/* View Preferences */}
            <SettingSection title="View Preferences" icon={Monitor}>
              <SelectSetting
                label="Default View Mode"
                value={formData.viewMode}
                onChange={(value) => updateField("viewMode", value as ViewMode)}
                options={[
                  { value: "grid", label: "Grid" },
                  { value: "list", label: "List" },
                  { value: "details", label: "Details" },
                ]}
              />

              <NumberSetting
                label="Sidebar Width (px)"
                value={formData.sidebarWidth}
                onChange={(value) => updateField("sidebarWidth", value)}
                min={150}
                max={500}
              />
            </SettingSection>

            {/* Theme Settings */}
            <SettingSection title="Appearance" icon={Sun}>
              <SettingItem label="Theme">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={formData.selectedTheme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateField("selectedTheme", "light")}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    type="button"
                    variant={formData.selectedTheme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateField("selectedTheme", "dark")}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    type="button"
                    variant={formData.selectedTheme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateField("selectedTheme", "system")}
                    className="flex items-center gap-2"
                  >
                    <Laptop className="h-4 w-4" />
                    System
                  </Button>
                </div>
              </SettingItem>
              {formData.selectedTheme === "system" && (
                <p className="text-xs text-muted-foreground ml-6">
                  Automatically switch between light and dark themes based on your system settings
                </p>
              )}
            </SettingSection>

            {/* Date Sync Defaults */}
            <SettingSection title="Date Sync Defaults" icon={Calendar}>
              <ToggleSetting
                label="Set Creation Date"
                checked={formData.dateSyncCreation}
                onCheckedChange={(checked) => updateField("dateSyncCreation", checked)}
              />

              <ToggleSetting
                label="Set Modified Date"
                checked={formData.dateSyncModified}
                onCheckedChange={(checked) => updateField("dateSyncModified", checked)}
              />
            </SettingSection>

            {/* Date Difference Defaults */}
            <SettingSection title="Date Difference Selection Defaults" icon={Calendar}>
              <ToggleSetting
                label="Check Creation Date"
                checked={formData.dateDiffCreation}
                onCheckedChange={(checked) => updateField("dateDiffCreation", checked)}
              />

              <ToggleSetting
                label="Check Modified Date"
                checked={formData.dateDiffModified}
                onCheckedChange={(checked) => updateField("dateDiffModified", checked)}
              />

              <NumberSetting
                label="Max Difference (days)"
                value={formData.dateDiffMaxDays}
                onChange={(value) => updateField("dateDiffMaxDays", value)}
                min={1}
                max={365}
              />
            </SettingSection>

            {/* Current Session Info */}
            <SettingSection title="Current Session" icon={FolderOpen} showSeparator={false}>
              <div className="text-sm text-muted-foreground">
                <div>
                  <span className="font-medium">Last Path:</span> {settings?.lastPath || "Not set"}
                </div>
                {settings?.windowBounds && (
                  <div className="mt-1">
                    <span className="font-medium">Window Size:</span> {settings.windowBounds.width}{" "}
                    × {settings.windowBounds.height}
                    {settings.windowBounds.x !== undefined &&
                      settings.windowBounds.y !== undefined && (
                        <span>
                          {" "}
                          at ({settings.windowBounds.x}, {settings.windowBounds.y})
                        </span>
                      )}
                  </div>
                )}
              </div>
            </SettingSection>
          </div>
        </ScrollArea>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="px-6 pb-4">
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <h4 className="text-sm font-medium text-destructive">Validation Errors</h4>
              </div>
              <ul className="text-sm text-destructive space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>
                    <span className="font-medium">{error.path}:</span> {error.message}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isDirty || isSubmitting || !isValid}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
