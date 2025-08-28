export interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  size: number
  modified: Date | null
  created: Date | null
  extension: string
  mediaType?: 'video' | 'audio' | 'image' | null
  encodedDate?: Date | null
}

export interface DriveInfo {
  name: string
  path: string
  type: 'drive'
  freeSpace?: number
  totalSize?: number
}

export interface PathInfo {
  exists: boolean
  isDirectory?: boolean
  size?: number
  modified?: Date
  created?: Date
  error?: string
}

export type ViewMode = 'grid' | 'list' | 'details'

export interface ExplorerState {
  currentPath: string
  selectedItems: string[]
  viewMode: ViewMode
  showHidden: boolean
  sortBy: 'name' | 'size' | 'modified' | 'type'
  sortOrder: 'asc' | 'desc'
}

declare global {
  interface Window {
    electronAPI: {
      getAppInfo: () => Promise<{ name: string; version: string }>
      sendMessage: (channel: string, data: any) => void
      onMessage: (channel: string, func: (...args: any[]) => void) => void
      fileSystem: {
        getDrives: () => Promise<DriveInfo[]>
        readDirectory: (path: string) => Promise<FileItem[]>
        getPathInfo: (path: string) => Promise<PathInfo>
        getEncodedDates: (fileItems: FileItem[]) => Promise<Record<string, Date>>
        openFile: (path: string) => Promise<{ success: boolean; error?: string }>
        showItemInFolder: (path: string) => Promise<{ success: boolean; error?: string }>
      }
    }
  }
}