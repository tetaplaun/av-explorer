"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ListChecks,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  FolderInput,
  FileEdit,
  CalendarClock,
  CalendarSearch,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface FileActionsBarProps {
  isMultiSelectMode: boolean
  onMultiSelectToggle: () => void
  selectedCount: number
  hasFilesWithEncodedDates?: boolean
  onCopy?: () => void
  onCut?: () => void
  onPaste?: () => void
  onDelete?: () => void
  onRename?: () => void
  onMove?: () => void
  onSyncDates?: () => void
  onSelectDateDifferences?: () => void
}

export function FileActionsBar({
  isMultiSelectMode,
  onMultiSelectToggle,
  selectedCount,
  hasFilesWithEncodedDates = false,
  onCopy,
  onCut,
  onPaste,
  onDelete,
  onRename,
  onMove,
  onSyncDates,
  onSelectDateDifferences,
}: FileActionsBarProps) {
  const hasSelection = selectedCount > 0
  const singleSelection = selectedCount === 1

  return (
    <div className="border-b border-border bg-card px-4 py-1">
      <div className="flex items-center gap-1">
        {/* Multiselect Toggle */}
        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant={isMultiSelectMode ? "secondary" : "ghost"}
                size="sm"
                onClick={onMultiSelectToggle}
                className={cn("h-8 px-2", isMultiSelectMode && "bg-primary/10 hover:bg-primary/20")}
              >
                <ListChecks className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isMultiSelectMode ? "Exit selection mode" : "Enter selection mode"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Select Date Differences Button */}
        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSelectDateDifferences}
                disabled={!onSelectDateDifferences}
                className="h-8 px-2"
              >
                <CalendarSearch className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Select files with date differences</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Date Sync Button */}
        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSyncDates}
                disabled={!hasSelection || !hasFilesWithEncodedDates || !onSyncDates}
                className="h-8 px-2"
              >
                <CalendarClock className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Sync dates with encoded date</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6" />

        {/* File Actions */}
        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                disabled={!hasSelection || !onCopy}
                className="h-8 px-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCut}
                disabled={!hasSelection || !onCut}
                className="h-8 px-2"
              >
                <Scissors className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cut</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPaste}
                disabled={!onPaste}
                className="h-8 px-2"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Paste</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6" />

        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRename}
                disabled={!singleSelection || !onRename}
                className="h-8 px-2"
              >
                <FileEdit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Rename</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMove}
                disabled={!hasSelection || !onMove}
                className="h-8 px-2"
              >
                <FolderInput className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Move to...</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                disabled={!hasSelection || !onDelete}
                className="h-8 px-2 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Selection Count */}
        {isMultiSelectMode && selectedCount > 0 && (
          <>
            <Separator orientation="vertical" className="h-6 ml-auto" />
            <span className="ml-2 text-sm text-muted-foreground">
              {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
            </span>
          </>
        )}
      </div>
    </div>
  )
}
