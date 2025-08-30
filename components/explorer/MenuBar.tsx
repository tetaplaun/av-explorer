"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  File,
  Edit,
  Eye,
  Settings,
  HelpCircle,
  FolderOpen,
  RotateCw,
  Copy,
  Scissors,
  Clipboard,
  Trash2,
  FileEdit,
  FolderInput,
  CalendarClock,
  CalendarSearch,
  ListChecks,
  Home,
  ArrowLeft,
  ArrowRight,
  Grid3x3,
  List,
  TableProperties,
  Search,
  X,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { ViewMode } from "@/types/explorer"

interface MenuBarProps {
  // Navigation
  currentPath: string
  onNavigate: (path: string) => void
  canGoBack: boolean
  canGoForward: boolean
  onBack: () => void
  onForward: () => void
  onUp: () => void
  onRefresh: () => void

  // View
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void

  // Search
  onSearch?: (query: string) => void
  onClearSearch?: () => void

  // File operations
  isMultiSelectMode: boolean
  selectedCount: number
  hasFilesWithEncodedDates?: boolean
  onMultiSelectToggle: () => void

  // Special operations
  onSyncDates?: () => void
  onSelectDateDifferences?: () => void

  // App settings
  onSettingsClick?: () => void
}

export function MenuBar({
  currentPath,
  onNavigate,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  onUp,
  onRefresh,
  viewMode,
  onViewModeChange,
  onSearch,
  onClearSearch,
  isMultiSelectMode,
  selectedCount,
  hasFilesWithEncodedDates = false,
  onMultiSelectToggle,
  onSyncDates,
  onSelectDateDifferences,
  onSettingsClick,
}: MenuBarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const hasSelection = selectedCount > 0
  const singleSelection = selectedCount === 1

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null)
      }
    }

    if (openMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [openMenu])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && openMenu) {
        setOpenMenu(null)
      }
    }

    if (openMenu) {
      document.addEventListener("keydown", handleKeyDown)
      return () => document.removeEventListener("keydown", handleKeyDown)
    }
  }, [openMenu])

  const handleMenuItemClick = (action: () => void) => {
    action()
    setOpenMenu(null)
  }

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName)
  }

  const MenuItem = ({
    icon: Icon,
    label,
    shortcut,
    disabled = false,
    onClick,
    destructive = false,
  }: {
    icon?: React.ComponentType<any>
    label: string
    shortcut?: string
    disabled?: boolean
    onClick: () => void
    destructive?: boolean
  }) => (
    <button
      className={cn(
        "flex w-full items-center gap-3 px-3 py-2 text-sm outline-none transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        disabled && "opacity-50 cursor-not-allowed",
        destructive && "hover:bg-destructive/10 hover:text-destructive"
      )}
      onClick={() => !disabled && handleMenuItemClick(onClick)}
      disabled={disabled}
    >
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1 text-left">{label}</span>
      {shortcut && <span className="text-xs text-muted-foreground">{shortcut}</span>}
    </button>
  )

  return (
    <div ref={menuRef} className="relative border-b border-border bg-card">
      <div className="flex items-center h-8 px-2">
        {/* File Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMenu("file")}
            className={cn("h-7 px-3 text-sm font-normal", openMenu === "file" && "bg-accent")}
          >
            <File className="h-4 w-4 mr-2" />
            File
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>

          {openMenu === "file" && (
            <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-md border border-border bg-popover p-1 shadow-lg">
              <MenuItem
                icon={Home}
                label="Go to Home"
                shortcut="Alt+H"
                onClick={() => onNavigate("")}
              />
              <Separator className="my-1" />
              <MenuItem
                icon={FolderOpen}
                label="Open Folder..."
                shortcut="Ctrl+O"
                onClick={() => onNavigate("")} // Placeholder
              />
              <Separator className="my-1" />
              <MenuItem
                icon={Settings}
                label="Settings"
                shortcut="Ctrl+,"
                onClick={() => onSettingsClick?.()}
              />
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMenu("edit")}
            className={cn("h-7 px-3 text-sm font-normal", openMenu === "edit" && "bg-accent")}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>

          {openMenu === "edit" && (
            <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-md border border-border bg-popover p-1 shadow-lg">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                Not yet implemented
              </div>
              <MenuItem label="Copy, Cut, Paste operations" disabled={true} onClick={() => {}} />
              <MenuItem
                label="Rename, Move, Delete operations"
                disabled={true}
                onClick={() => {}}
              />
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMenu("view")}
            className={cn("h-7 px-3 text-sm font-normal", openMenu === "view" && "bg-accent")}
          >
            <Eye className="h-4 w-4 mr-2" />
            View
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>

          {openMenu === "view" && (
            <div className="absolute top-full left-0 z-50 mt-1 w-56 rounded-md border border-border bg-popover p-1 shadow-lg">
              <MenuItem
                icon={ArrowLeft}
                label="Go Back"
                shortcut="Alt+←"
                disabled={!canGoBack}
                onClick={onBack}
              />
              <MenuItem
                icon={ArrowRight}
                label="Go Forward"
                shortcut="Alt+→"
                disabled={!canGoForward}
                onClick={onForward}
              />
              <MenuItem
                icon={ArrowLeft}
                label="Go Up"
                shortcut="Alt+↑"
                disabled={!currentPath || currentPath.split(/[\\/]/).filter(Boolean).length <= 1}
                onClick={onUp}
              />
              <Separator className="my-1" />
              <MenuItem icon={RotateCw} label="Refresh" shortcut="F5" onClick={onRefresh} />
              <Separator className="my-1" />
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">View Mode</div>
              <MenuItem
                icon={Grid3x3}
                label="Grid View"
                shortcut="Ctrl+1"
                onClick={() => onViewModeChange("grid")}
              />
              <MenuItem
                icon={List}
                label="List View"
                shortcut="Ctrl+2"
                onClick={() => onViewModeChange("list")}
              />
              <MenuItem
                icon={TableProperties}
                label="Details View"
                shortcut="Ctrl+3"
                onClick={() => onViewModeChange("details")}
              />
            </div>
          )}
        </div>

        {/* Tools Menu */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMenu("tools")}
            className={cn("h-7 px-3 text-sm font-normal", openMenu === "tools" && "bg-accent")}
          >
            <Settings className="h-4 w-4 mr-2" />
            Tools
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>

          {openMenu === "tools" && (
            <div className="absolute top-full left-0 z-50 mt-1 w-64 rounded-md border border-border bg-popover p-1 shadow-lg">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Selection</div>
              <MenuItem
                icon={ListChecks}
                label={isMultiSelectMode ? "Exit Selection Mode" : "Enter Selection Mode"}
                shortcut="Ctrl+A"
                onClick={onMultiSelectToggle}
              />
              <MenuItem
                icon={CalendarSearch}
                label="Select Files with Date Differences"
                disabled={!onSelectDateDifferences}
                onClick={() => onSelectDateDifferences?.()}
              />

              <Separator className="my-1" />

              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                Date Operations
              </div>
              <MenuItem
                icon={CalendarClock}
                label="Sync Dates with Encoded Date"
                disabled={!hasSelection || !hasFilesWithEncodedDates || !onSyncDates}
                onClick={() => onSyncDates?.()}
              />

              <Separator className="my-1" />

              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Search</div>
              <MenuItem
                icon={Search}
                label="Search Files..."
                shortcut="Ctrl+F"
                onClick={() => onSearch?.("")}
              />
              {onClearSearch && (
                <MenuItem icon={X} label="Clear Search" shortcut="Esc" onClick={onClearSearch} />
              )}
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div className="relative ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleMenu("help")}
            className={cn("h-7 px-3 text-sm font-normal", openMenu === "help" && "bg-accent")}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            Help
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>

          {openMenu === "help" && (
            <div className="absolute top-full right-0 z-50 mt-1 w-56 rounded-md border border-border bg-popover p-1 shadow-lg">
              <MenuItem
                label="About AV Explorer"
                onClick={() => {
                  // Placeholder for about dialog
                  console.log("About clicked")
                }}
              />
              <MenuItem
                label="Keyboard Shortcuts"
                shortcut="F1"
                onClick={() => {
                  // Placeholder for shortcuts dialog
                  console.log("Shortcuts clicked")
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
