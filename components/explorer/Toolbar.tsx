"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCw,
  Grid3x3,
  List,
  TableProperties,
  Search,
  Home,
} from "lucide-react"
import { ViewMode } from "@/types/explorer"
import { getPathSegments } from "@/lib/fileUtils"

interface ToolbarProps {
  currentPath: string
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  onNavigate: (path: string) => void
  onBack: () => void
  onForward: () => void
  onUp: () => void
  onRefresh: () => void
  canGoBack: boolean
  canGoForward: boolean
}

export function Toolbar({
  currentPath,
  viewMode,
  onViewModeChange,
  onNavigate,
  onBack,
  onForward,
  onUp,
  onRefresh,
  canGoBack,
  canGoForward,
}: ToolbarProps) {
  // Only process path segments if we have a valid path
  const pathSegments = currentPath ? getPathSegments(currentPath) : []
  const canGoUp = pathSegments.length > 1

  return (
    <div className="border-b border-border bg-card px-4 py-2">
      <div className="flex items-center gap-2">
        {/* Navigation buttons */}
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onBack}
            disabled={!!!canGoBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onForward}
            disabled={!!!canGoForward}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onUp}
            disabled={!!!canGoUp}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Path breadcrumbs */}
        <div className="flex flex-1 items-center gap-1 overflow-x-auto">
          {pathSegments.length > 0 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onNavigate(pathSegments[0].path)}
              >
                <Home className="h-4 w-4" />
              </Button>
              {pathSegments.map((segment, index) => (
                <div key={segment.path} className="flex items-center">
                  {index > 0 && <span className="mx-1 text-muted-foreground">/</span>}
                  <Button
                    variant="ghost"
                    className="h-8 px-2 py-1 text-sm"
                    onClick={() => onNavigate(segment.path)}
                  >
                    {segment.name}
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* View mode buttons */}
        <div className="flex gap-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange("grid")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange("list")}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "details" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onViewModeChange("details")}
          >
            <TableProperties className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Action buttons */}
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onRefresh}>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
