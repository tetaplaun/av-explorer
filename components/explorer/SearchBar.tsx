"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { X, Search } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  onClear,
  placeholder = "Search files...",
  className,
}: SearchBarProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isExpanded])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim())
      } else {
        onClear()
      }
    }, 300) // Debounce search

    return () => clearTimeout(timeoutId)
  }, [query, onSearch, onClear])

  const handleToggle = () => {
    if (isExpanded && query) {
      // Clear search when collapsing
      setQuery("")
      onClear()
    }
    setIsExpanded(!isExpanded)
  }

  const handleClear = () => {
    setQuery("")
    onClear()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleClear()
      setIsExpanded(false)
    }
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div
        className={cn(
          "flex items-center transition-all duration-200 ease-in-out",
          isExpanded ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-9 pr-9 h-8"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
              onClick={handleClear}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={handleToggle}>
        <Search className="h-4 w-4" />
      </Button>
    </div>
  )
}
