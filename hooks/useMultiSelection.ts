import { useState, useCallback, useMemo } from "react"
import { FileItem } from "@/types/explorer"

interface UseMultiSelectionReturn<T = string> {
  selectedItems: T[]
  isMultiSelectMode: boolean
  selectionCount: number
  isSelected: (item: T) => boolean
  isAllSelected: (items: T[]) => boolean
  isNoneSelected: boolean
  isPartiallySelected: (items: T[]) => boolean
  toggleItem: (item: T) => void
  selectItem: (item: T) => void
  deselectItem: (item: T) => void
  selectAll: (items: T[]) => void
  selectNone: () => void
  toggleAll: (items: T[]) => void
  setSelectedItems: (items: T[]) => void
  toggleMultiSelectMode: () => void
  setMultiSelectMode: (enabled: boolean) => void
}

export function useMultiSelection<T = string>(
  initialSelection: T[] = [],
  initialMultiSelectMode: boolean = false
): UseMultiSelectionReturn<T> {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelection)
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(initialMultiSelectMode)

  const selectionCount = selectedItems.length
  const isNoneSelected = selectionCount === 0

  const isSelected = useCallback(
    (item: T): boolean => {
      return selectedItems.includes(item)
    },
    [selectedItems]
  )

  const isAllSelected = useCallback(
    (items: T[]): boolean => {
      if (items.length === 0) return false
      return items.every((item) => selectedItems.includes(item))
    },
    [selectedItems]
  )

  const isPartiallySelected = useCallback(
    (items: T[]): boolean => {
      if (items.length === 0) return false
      const selectedCount = items.filter((item) => selectedItems.includes(item)).length
      return selectedCount > 0 && selectedCount < items.length
    },
    [selectedItems]
  )

  const toggleItem = useCallback((item: T) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((selected) => selected !== item) : [...prev, item]
    )
  }, [])

  const selectItem = useCallback((item: T) => {
    setSelectedItems((prev) => (prev.includes(item) ? prev : [...prev, item]))
  }, [])

  const deselectItem = useCallback((item: T) => {
    setSelectedItems((prev) => prev.filter((selected) => selected !== item))
  }, [])

  const selectAll = useCallback(
    (items: T[]) => {
      setSelectedItems([...new Set([...selectedItems, ...items])])
    },
    [selectedItems]
  )

  const selectNone = useCallback(() => {
    setSelectedItems([])
  }, [])

  const toggleAll = useCallback(
    (items: T[]) => {
      const allSelected = isAllSelected(items)
      if (allSelected) {
        // Deselect all items
        setSelectedItems((prev) => prev.filter((item) => !items.includes(item)))
      } else {
        // Select all items
        setSelectedItems((prev) => [...new Set([...prev, ...items])])
      }
    },
    [isAllSelected]
  )

  const toggleMultiSelectMode = useCallback(() => {
    setIsMultiSelectMode((prev) => {
      if (prev) {
        // Exiting multi-select mode, clear selection
        setSelectedItems([])
      }
      return !prev
    })
  }, [])

  const setMultiSelectMode = useCallback((enabled: boolean) => {
    setIsMultiSelectMode(enabled)
    if (!enabled) {
      setSelectedItems([])
    }
  }, [])

  return {
    selectedItems,
    isMultiSelectMode,
    selectionCount,
    isSelected,
    isAllSelected,
    isNoneSelected,
    isPartiallySelected,
    toggleItem,
    selectItem,
    deselectItem,
    selectAll,
    selectNone,
    toggleAll,
    setSelectedItems,
    toggleMultiSelectMode,
    setMultiSelectMode,
  }
}

// Specialized hook for file selection with additional utilities
export function useFileSelection(
  initialSelection: string[] = [],
  initialMultiSelectMode: boolean = false
) {
  const selection = useMultiSelection(initialSelection, initialMultiSelectMode)

  // Additional utilities specific to file operations
  const selectedFilesInfo = useMemo(() => {
    return {
      count: selection.selectionCount,
      hasSelection: selection.selectionCount > 0,
      isSingleSelection: selection.selectionCount === 1,
      isMultipleSelection: selection.selectionCount > 1,
    }
  }, [selection.selectionCount])

  const hasFilesWithEncodedDates = useCallback(
    (files: FileItem[]) => {
      if (selection.selectedItems.length === 0) return false
      return selection.selectedItems.some((filePath) => {
        const file = files.find((f) => f.path === filePath)
        return file && file.encodedDate
      })
    },
    [selection.selectedItems]
  )

  const getSelectedFileItems = useCallback(
    (files: FileItem[]): FileItem[] => {
      return selection.selectedItems
        .map((filePath) => files.find((f) => f.path === filePath))
        .filter((file): file is FileItem => file !== undefined)
    },
    [selection.selectedItems]
  )

  return {
    ...selection,
    ...selectedFilesInfo,
    hasFilesWithEncodedDates,
    getSelectedFileItems,
  }
}
