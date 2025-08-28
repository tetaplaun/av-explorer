"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FileItem } from "@/types/explorer"
import { cn } from "@/lib/utils"

interface DirectoryTreeProps {
  rootPath: string
  selectedPath: string
  onPathSelect: (path: string) => void
}

interface TreeNode {
  path: string
  name: string
  children?: TreeNode[]
  isExpanded: boolean
  isLoading: boolean
}

export function DirectoryTree({ rootPath, selectedPath, onPathSelect }: DirectoryTreeProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (rootPath && rootPath.trim() !== "") {
      loadDirectory(rootPath)
    }
  }, [rootPath])

  // Expand tree to show selected path when it changes
  useEffect(() => {
    if (selectedPath && selectedPath.trim() !== "") {
      expandToPath(selectedPath)
    }
  }, [selectedPath])

  const loadDirectory = async (path: string) => {
    try {
      if (!path || path.trim() === "") {
        setTreeData([])
        return
      }
      const items = await window.electronAPI.fileSystem.readDirectory(path)
      const directories = items
        .filter((item) => item.isDirectory)
        .map((dir) => ({
          path: dir.path,
          name: dir.name,
          isExpanded: expandedPaths.has(dir.path),
          isLoading: false,
          children: expandedPaths.has(dir.path) ? [] : undefined,
        }))

      setTreeData(directories)

      // Load children for expanded directories
      for (const dir of directories) {
        if (expandedPaths.has(dir.path)) {
          // Check if this directory is part of the selected path
          if (selectedPath && selectedPath.startsWith(dir.path)) {
            // Load recursively if it's in the selected path
            const hierarchy = getPathHierarchy(selectedPath)
            await loadChildrenRecursive(dir.path, hierarchy)
          } else {
            // Normal load for other expanded directories
            await loadChildren(dir.path)
          }
        }
      }
    } catch (error) {
      console.error("Failed to load directory:", error)
    }
  }

  const loadChildren = async (path: string) => {
    try {
      const items = await window.electronAPI.fileSystem.readDirectory(path)
      const directories = items
        .filter((item) => item.isDirectory)
        .map((dir) => ({
          path: dir.path,
          name: dir.name,
          isExpanded: expandedPaths.has(dir.path),
          isLoading: false,
          children: expandedPaths.has(dir.path) ? [] : undefined,
        }))

      updateNodeChildren(path, directories)
    } catch (error) {
      console.error("Failed to load children:", error)
    }
  }

  const updateNodeChildren = (path: string, children: TreeNode[]) => {
    setTreeData((prevData) => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map((node) => {
          if (node.path === path) {
            return { ...node, children, isLoading: false }
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) }
          }
          return node
        })
      }
      return updateNode(prevData)
    })
  }

  const getPathHierarchy = (targetPath: string): string[] => {
    const hierarchy: string[] = []
    const segments = targetPath.split(/[\\/]/).filter(Boolean)
    
    if (segments.length === 0) return hierarchy
    
    // Detect Windows path
    const isWindowsPath = /^[A-Za-z]:?$/.test(segments[0])
    
    let currentPath = ""
    for (let i = 0; i < segments.length; i++) {
      if (i === 0) {
        currentPath = segments[0] + (isWindowsPath ? "\\" : "")
      } else {
        currentPath = isWindowsPath 
          ? currentPath + (currentPath.endsWith("\\") ? "" : "\\") + segments[i]
          : currentPath + "/" + segments[i]
      }
      hierarchy.push(currentPath)
    }
    
    return hierarchy
  }

  const expandToPath = async (targetPath: string) => {
    // Get all parent paths that need to be expanded
    const pathHierarchy = getPathHierarchy(targetPath)
    
    // Remove the last item if it's the target path itself (we don't expand the target, just its parents)
    if (pathHierarchy.length > 0 && pathHierarchy[pathHierarchy.length - 1] === targetPath) {
      pathHierarchy.pop()
    }
    
    // Start from root and ensure it matches
    if (!rootPath || !targetPath.startsWith(rootPath)) {
      return
    }
    
    const newExpanded = new Set(expandedPaths)
    
    // Expand each level sequentially
    for (const pathToExpand of pathHierarchy) {
      // Only expand paths that are under our root and not already expanded
      if (pathToExpand.startsWith(rootPath) && !newExpanded.has(pathToExpand)) {
        newExpanded.add(pathToExpand)
      }
    }
    
    // Update expanded paths state
    setExpandedPaths(newExpanded)
    
    // Load children for newly expanded paths
    for (const pathToExpand of pathHierarchy) {
      if (pathToExpand.startsWith(rootPath) && !expandedPaths.has(pathToExpand)) {
        await loadChildrenRecursive(pathToExpand, pathHierarchy)
      }
    }
  }

  const loadChildrenRecursive = async (path: string, fullHierarchy: string[]) => {
    try {
      const items = await window.electronAPI.fileSystem.readDirectory(path)
      const directories = items
        .filter((item) => item.isDirectory)
        .map((dir) => {
          // Check if this directory is in our hierarchy and should be expanded
          const shouldExpand = fullHierarchy.includes(dir.path)
          return {
            path: dir.path,
            name: dir.name,
            isExpanded: shouldExpand,
            isLoading: false,
            children: shouldExpand ? [] : undefined,
          }
        })

      updateNodeChildren(path, directories)
      
      // Recursively load children for directories in the hierarchy
      for (const dir of directories) {
        if (fullHierarchy.includes(dir.path)) {
          await loadChildrenRecursive(dir.path, fullHierarchy)
        }
      }
    } catch (error) {
      console.error("Failed to load children recursively:", error)
    }
  }

  const toggleExpand = async (node: TreeNode) => {
    const newExpanded = new Set(expandedPaths)

    if (expandedPaths.has(node.path)) {
      newExpanded.delete(node.path)
    } else {
      newExpanded.add(node.path)
      if (!node.children) {
        await loadChildren(node.path)
      }
    }

    setExpandedPaths(newExpanded)
  }

  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedPaths.has(node.path)
    const isSelected = selectedPath === node.path

    return (
      <div key={node.path}>
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={cn("w-full justify-start px-2 py-1 h-auto", "hover:bg-muted")}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={(e) => {
            if (e.detail === 1) {
              onPathSelect(node.path)
            }
          }}
        >
          <div
            className="mr-1 p-0.5 hover:bg-muted rounded cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              toggleExpand(node)
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </div>
          {isExpanded ? (
            <FolderOpen className="mr-2 h-4 w-4 text-yellow-500" />
          ) : (
            <Folder className="mr-2 h-4 w-4 text-yellow-500" />
          )}
          <span className="text-sm truncate text-foreground">{node.name}</span>
        </Button>
        {isExpanded && node.children && (
          <div>{node.children.map((child) => renderNode(child, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="py-2">
      <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-gray-400">Folders</h3>
      {treeData.map((node) => renderNode(node))}
    </div>
  )
}
