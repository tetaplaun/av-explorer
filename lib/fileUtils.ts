import { HardDrive } from 'lucide-react'
import { getCachedFileIcon, folderIcon, folderOpenIcon } from './fileIconMapping'
import path from 'path'

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

export function formatDateTime(date: Date | null): string {
  if (!date) return '-'
  
  const d = new Date(date)
  
  // Check if the date is valid
  if (isNaN(d.getTime())) {
    return '-'
  }
  
  // Format: dd.mm.yyyy hh:mm
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  
  return `${day}.${month}.${year} ${hours}:${minutes}`
}

export function getFileIcon(
  extension: string,
  isDirectory: boolean,
  mediaType?: 'video' | 'audio' | 'image' | null,
  filename?: string
) {
  if (isDirectory) {
    return folderIcon.icon
  }
  
  // Use the comprehensive icon mapping system
  const name = filename || ''
  const iconMapping = getCachedFileIcon(name, extension)
  return iconMapping.icon
}

export function getFileIconColor(
  mediaType?: 'video' | 'audio' | 'image' | null,
  extension?: string,
  isDirectory?: boolean,
  filename?: string
): string {
  if (isDirectory) {
    return folderIcon.color
  }
  
  // Use the comprehensive icon mapping system
  const ext = extension || ''
  const name = filename || ''
  const iconMapping = getCachedFileIcon(name, ext)
  return iconMapping.color
}

export function getDriveIcon() {
  return HardDrive
}

export function truncateFilename(filename: string, maxLength: number = 30): { 
  display: string
  needsTooltip: boolean 
} {
  if (filename.length <= maxLength) {
    return { display: filename, needsTooltip: false }
  }

  // Find the last dot for extension
  const lastDotIndex = filename.lastIndexOf('.')
  const hasExtension = lastDotIndex > 0 && lastDotIndex < filename.length - 1
  
  if (!hasExtension) {
    // No extension, just truncate with ellipsis
    return { 
      display: filename.substring(0, maxLength - 3) + '...', 
      needsTooltip: true 
    }
  }

  const name = filename.substring(0, lastDotIndex)
  const extension = filename.substring(lastDotIndex)
  
  // Reserve space for extension and ellipsis
  const availableSpace = maxLength - extension.length - 3
  
  if (availableSpace <= 0) {
    // Extension is too long, just show extension with ellipsis
    return { 
      display: '...' + extension, 
      needsTooltip: true 
    }
  }
  
  // Truncate the name part and keep the extension
  const truncatedName = name.substring(0, availableSpace)
  return { 
    display: truncatedName + '...' + extension, 
    needsTooltip: true 
  }
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
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico', '.tiff',
    '.heic', '.heif', '.avif', '.raw', '.dng', '.cr2', '.cr3', '.nef', '.arw', '.orf', '.rw2'
  ]
  
  return mediaExtensions.includes(extension.toLowerCase())
}