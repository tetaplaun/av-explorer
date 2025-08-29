"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, ChevronDown, Folder, FolderOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  hasSubdirectories?: boolean
}

export function DirectoryTree({ rootPath, selectedPath, onPathSelect }: DirectoryTreeProps) {
  const [treeData, setTreeData] = useState<TreeNode[]>([])
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set())
  const selectedNodeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (rootPath && rootPath.trim() !== "") {
      loadDirectory(rootPath)
    }
  }, [rootPath])

  // Removed automatic expansion - directories only expand when user clicks

  // Scroll to selected node if it's visible in the tree
  useEffect(() => {
    if (selectedNodeRef.current && containerRef.current) {
      // Only scroll if the node is already visible (parent is expanded)
      selectedNodeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      })
    }
  }, [selectedPath])

  const loadDirectory = async (path: string) => {
    try {
      if (!path || path.trim() === "") {
        setTreeData([])
        return
      }
      const items = await window.electronAPI.fileSystem.readDirectory(path)
      const directories = items.filter((item) => item.isDirectory)

      // For each directory, check if it has subdirectories
      const directoriesWithInfo = await Promise.all(
        directories.map(async (dir) => {
          let hasSubdirs = false
          try {
            const subItems = await window.electronAPI.fileSystem.readDirectory(dir.path)
            hasSubdirs = subItems.some((item) => item.isDirectory)
          } catch {
            // If we can't read the directory, don't show expand chevron
            hasSubdirs = false
          }

          return {
            path: dir.path,
            name: dir.name,
            isExpanded: expandedPaths.has(dir.path),
            isLoading: false,
            hasSubdirectories: hasSubdirs,
            children: expandedPaths.has(dir.path) ? [] : undefined,
          }
        })
      )

      setTreeData(directoriesWithInfo)

      // Load children for already expanded directories
      for (const dir of directoriesWithInfo) {
        if (expandedPaths.has(dir.path)) {
          await loadChildren(dir.path)
        }
      }
    } catch (error) {
      console.error("Failed to load directory:", error)
    }
  }

  const loadChildren = async (path: string) => {
    try {
      const items = await window.electronAPI.fileSystem.readDirectory(path)
      const directories = items.filter((item) => item.isDirectory)

      // For each directory, check if it has subdirectories
      const directoriesWithInfo = await Promise.all(
        directories.map(async (dir) => {
          let hasSubdirs = false
          try {
            const subItems = await window.electronAPI.fileSystem.readDirectory(dir.path)
            hasSubdirs = subItems.some((item) => item.isDirectory)
          } catch {
            // If we can't read the directory, don't show expand chevron
            hasSubdirs = false
          }

          return {
            path: dir.path,
            name: dir.name,
            isExpanded: expandedPaths.has(dir.path), // Preserve expansion state
            isLoading: false,
            hasSubdirectories: hasSubdirs,
            children: expandedPaths.has(dir.path) ? [] : undefined, // Load children if already expanded
          }
        })
      )

      updateNodeChildren(path, directoriesWithInfo)

      // Load children for any already expanded subdirectories
      for (const dir of directoriesWithInfo) {
        if (expandedPaths.has(dir.path)) {
          await loadChildren(dir.path)
        }
      }
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

  // Removed getPathHierarchy, expandToPath, and loadChildrenRecursive functions
  // Directory tree now only expands when user manually clicks expand buttons

  const toggleExpand = async (node: TreeNode) => {
    const newExpanded = new Set(expandedPaths)

    if (expandedPaths.has(node.path)) {
      // When collapsing, also remove any expanded children
      newExpanded.delete(node.path)
      // Remove all paths that start with this node's path
      for (const expandedPath of newExpanded) {
        if (expandedPath.startsWith(node.path + (node.path.endsWith("\\") ? "" : "\\"))) {
          newExpanded.delete(expandedPath)
        }
      }
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
      <div key={node.path} ref={isSelected ? selectedNodeRef : null}>
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
          {node.hasSubdirectories === true ? (
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
          ) : (
            <div className="mr-1 p-0.5 w-4" />
          )}
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
    <div className="py-2" ref={containerRef}>
      <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-gray-400">Folders</h3>
      {treeData.map((node) => renderNode(node))}
    </div>
  )
}
