export interface FileItem {
  name: string
  path: string
  isDirectory: boolean
  size: number
  modified: Date | null
  created: Date | null
  extension: string
  mediaType?: "video" | "audio" | "image" | null
  encodedDate?: Date | null
}

export interface DriveInfo {
  name: string
  path: string
  type: "drive"
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

export type ViewMode = "grid" | "list" | "details"

export interface ExplorerState {
  currentPath: string
  selectedItems: string[]
  viewMode: ViewMode
  showHidden: boolean
  sortBy: "name" | "size" | "modified" | "type"
  sortOrder: "asc" | "desc"
}

export type Theme = "light" | "dark" | "system"

export interface AppSettings {
  viewMode: ViewMode
  lastPath: string
  windowBounds: { width: number; height: number; x?: number; y?: number }
  sidebarWidth: number
  theme: Theme
  dateSyncDefaults: {
    setCreationDate: boolean
    setModifiedDate: boolean
  }
  dateDifferenceDefaults: {
    checkCreationDate: boolean
    checkModifiedDate: boolean
    maxDifferenceInDays: number
  }
}

declare global {
  interface Window {
    electronAPI: {
      getAppInfo: () => Promise<{ name: string; version: string }>
      sendMessage: (channel: string, data: any) => void
      onMessage: (channel: string, func: (...args: any[]) => void) => void
      settings: {
        get: <K extends keyof AppSettings>(key: K) => Promise<AppSettings[K]>
        set: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>
        getAll: () => Promise<AppSettings>
      }
      fileSystem: {
        getDrives: () => Promise<DriveInfo[]>
        readDirectory: (path: string) => Promise<FileItem[]>
        getPathInfo: (path: string) => Promise<PathInfo>
        getEncodedDates: (fileItems: FileItem[]) => Promise<Record<string, Date>>
        getEncodedDatesProgressive: (fileItems: FileItem[]) => Promise<Record<string, Date>>
        openFile: (path: string) => Promise<{ success: boolean; error?: string }>
        showItemInFolder: (path: string) => Promise<{ success: boolean; error?: string }>
        setFileDates: (
          files: FileItem[],
          options: { setCreationDate: boolean; setModifiedDate: boolean }
        ) => Promise<Array<{ path: string; success: boolean; error?: string }>>
      }
    }
  }
}
