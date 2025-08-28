'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Folder, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FileItem } from '@/types/explorer'
import { cn } from '@/lib/utils'

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
    loadDirectory(rootPath)
  }, [rootPath])

  const loadDirectory = async (path: string) => {
    try {
      const items = await window.electronAPI.fileSystem.readDirectory(path)
      const directories = items
        .filter(item => item.isDirectory)
        .map(dir => ({
          path: dir.path,
          name: dir.name,
          isExpanded: expandedPaths.has(dir.path),
          isLoading: false,
          children: expandedPaths.has(dir.path) ? [] : undefined
        }))
      
      setTreeData(directories)
      
      // Load children for expanded directories
      for (const dir of directories) {
        if (expandedPaths.has(dir.path)) {
          loadChildren(dir.path)
        }
      }
    } catch (error) {
      console.error('Failed to load directory:', error)
    }
  }

  const loadChildren = async (path: string) => {
    try {
      const items = await window.electronAPI.fileSystem.readDirectory(path)
      const directories = items
        .filter(item => item.isDirectory)
        .map(dir => ({
          path: dir.path,
          name: dir.name,
          isExpanded: expandedPaths.has(dir.path),
          isLoading: false,
          children: expandedPaths.has(dir.path) ? [] : undefined
        }))
      
      updateNodeChildren(path, directories)
    } catch (error) {
      console.error('Failed to load children:', error)
    }
  }

  const updateNodeChildren = (path: string, children: TreeNode[]) => {
    setTreeData(prevData => {
      const updateNode = (nodes: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
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
          className={cn(
            "w-full justify-start px-2 py-1 h-auto",
            "hover:bg-gray-700"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={(e) => {
            if (e.detail === 1) {
              onPathSelect(node.path)
            }
          }}
        >
          <button
            className="mr-1 p-0.5 hover:bg-gray-600 rounded"
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
          </button>
          {isExpanded ? (
            <FolderOpen className="mr-2 h-4 w-4 text-yellow-600" />
          ) : (
            <Folder className="mr-2 h-4 w-4 text-yellow-600" />
          )}
          <span className="text-sm truncate">{node.name}</span>
        </Button>
        {isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="py-2">
      <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-gray-400">
        Folders
      </h3>
      {treeData.map(node => renderNode(node))}
    </div>
  )
}