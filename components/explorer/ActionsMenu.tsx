"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ListChecks,
  CalendarSearch,
  CalendarClock,
  MoreVertical,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  FolderInput,
  FileEdit,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionsMenuProps {
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

export function ActionsMenu({
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
}: ActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const hasSelection = selectedCount > 0
  const singleSelection = selectedCount === 1

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  const handleMenuItemClick = (action: () => void) => {
    action()
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className={cn("h-8 px-2", isOpen && "bg-muted")}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <MoreVertical className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full z-50 mt-1 w-56 rounded-md border border-border bg-popover p-1 shadow-md"
          role="menu"
        >
          {/* Select Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Select</div>

          <button
            className={cn(
              "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isMultiSelectMode && "bg-accent text-accent-foreground"
            )}
            onClick={() => handleMenuItemClick(onMultiSelectToggle)}
            role="menuitem"
          >
            <ListChecks className="h-4 w-4" />
            <span className="flex-1 text-left">
              {isMultiSelectMode ? "Exit selection mode" : "Enter selection mode"}
            </span>
            {isMultiSelectMode && (
              <span className="text-xs text-muted-foreground">{selectedCount} selected</span>
            )}
          </button>

          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => handleMenuItemClick(onSelectDateDifferences!)}
            disabled={!onSelectDateDifferences}
            role="menuitem"
          >
            <CalendarSearch className="h-4 w-4" />
            Select files with date differences
          </button>

          <Separator className="my-1" />

          {/* Commands Section */}
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Commands</div>

          <button
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => handleMenuItemClick(onSyncDates!)}
            disabled={!hasSelection || !hasFilesWithEncodedDates || !onSyncDates}
            role="menuitem"
          >
            <CalendarClock className="h-4 w-4" />
            Sync dates with encoded date
          </button>

          {/* Additional Commands */}
          {hasSelection && (
            <>
              <Separator className="my-1" />
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                File Actions
              </div>

              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleMenuItemClick(onCopy!)}
                disabled={!onCopy}
                role="menuitem"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>

              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleMenuItemClick(onCut!)}
                disabled={!onCut}
                role="menuitem"
              >
                <Scissors className="h-4 w-4" />
                Cut
              </button>

              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleMenuItemClick(onPaste!)}
                disabled={!onPaste}
                role="menuitem"
              >
                <Clipboard className="h-4 w-4" />
                Paste
              </button>

              <Separator className="my-1" />

              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleMenuItemClick(onRename!)}
                disabled={!singleSelection || !onRename}
                role="menuitem"
              >
                <FileEdit className="h-4 w-4" />
                Rename
              </button>

              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleMenuItemClick(onMove!)}
                disabled={!onMove}
                role="menuitem"
              >
                <FolderInput className="h-4 w-4" />
                Move to...
              </button>

              <button
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 disabled:pointer-events-none"
                onClick={() => handleMenuItemClick(onDelete!)}
                disabled={!onDelete}
                role="menuitem"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
