import { FileVideo, Music, Image, Folder, File, HardDrive } from 'lucide-react'

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const k = 1024
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${units[i]}`
}

export function formatDate(date: Date | null): string {
  if (!date) return ''
  
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return 'Today'
  } else if (days === 1) {
    return 'Yesterday'
  } else if (days < 7) {
    return `${days} days ago`
  } else {
    return new Date(date).toLocaleDateString()
  }
}

export function getFileIcon(
  extension: string,
  isDirectory: boolean,
  mediaType?: 'video' | 'audio' | 'image' | null
) {
  if (isDirectory) {
    return Folder
  }
  
  switch (mediaType) {
    case 'video':
      return FileVideo
    case 'audio':
      return Music
    case 'image':
      return Image
    default:
      return File
  }
}

export function getFileIconColor(mediaType?: 'video' | 'audio' | 'image' | null): string {
  switch (mediaType) {
    case 'video':
      return 'text-purple-500'
    case 'audio':
      return 'text-green-500'
    case 'image':
      return 'text-blue-500'
    default:
      return 'text-gray-400'
  }
}

export function getDriveIcon() {
  return HardDrive
}

export function getPathSegments(path: string): { name: string; path: string }[] {
  const segments = []
  const parts = path.split(/[\\/]/).filter(Boolean)
  
  // Detect Windows path by checking for drive letter pattern (e.g., C:, D:)
  const isWindowsPath = parts.length > 0 && /^[A-Za-z]:?$/.test(parts[0])
  
  if (isWindowsPath) {
    // Handle Windows drive letters
    segments.push({
      name: parts[0].replace(':', ''),
      path: parts[0] + (parts[0].includes(':') ? '\\' : ':\\')
    })
    
    for (let i = 1; i < parts.length; i++) {
      segments.push({
        name: parts[i],
        path: parts.slice(0, i + 1).join('\\') + (i === 0 ? '\\' : '')
      })
    }
  } else {
    // Handle Unix-like paths
    let currentPath = '/'
    segments.push({ name: 'Root', path: '/' })
    
    for (const part of parts) {
      currentPath = currentPath === '/' ? `/${part}` : `${currentPath}/${part}`
      segments.push({
        name: part,
        path: currentPath
      })
    }
  }
  
  return segments
}

export function isMediaFile(extension: string): boolean {
  const mediaExtensions = [
    '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg',
    '.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus',
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico', '.tiff'
  ]
  
  return mediaExtensions.includes(extension.toLowerCase())
}