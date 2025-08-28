const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs').promises
const { exec } = require('child_process')
const { promisify } = require('util')
const execPromise = promisify(exec)
const isDev = process.env.NODE_ENV === 'development'

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hiddenInset',
    icon: path.join(__dirname, '../public/icon.png')
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../out/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.handle('app-info', () => {
  return {
    name: app.getName(),
    version: app.getVersion()
  }
})

// File System Operations
ipcMain.handle('get-drives', async () => {
  if (process.platform === 'win32') {
    try {
      // Use PowerShell instead of deprecated wmic command
      const { stdout } = await execPromise('powershell -Command "Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{Name=\'FreeSpace\';Expression={$_.Free}}, @{Name=\'TotalSize\';Expression={$_.Used + $_.Free}} | ConvertTo-Json"')
      const drivesData = JSON.parse(stdout)
      const drives = []
      
      // Ensure drivesData is an array
      const drivesList = Array.isArray(drivesData) ? drivesData : [drivesData]
      
      for (const drive of drivesList) {
        if (drive.Name && drive.Name.length === 1) { // Only single letter drives
          drives.push({
            name: drive.Name + ':',
            path: drive.Name + ':\\',
            type: 'drive',
            freeSpace: drive.FreeSpace || 0,
            totalSize: drive.TotalSize || 0
          })
        }
      }
      
      return drives
    } catch (error) {
      console.error('Error getting drives:', error)
      // Fallback: try to detect drives using fs.existsSync
      const drives = []
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
      
      for (const letter of letters) {
        const drivePath = `${letter}:\\`
        try {
          await fs.access(drivePath)
          drives.push({
            name: `${letter}:`,
            path: drivePath,
            type: 'drive',
            freeSpace: 0,
            totalSize: 0
          })
        } catch {
          // Drive doesn't exist, skip
        }
      }
      
      return drives
    }
  } else {
    // For Unix-like systems, return root
    return [{
      name: 'Root',
      path: '/',
      type: 'drive'
    }]
  }
})

ipcMain.handle('read-directory', async (event, dirPath) => {
  try {
    // Validate the directory path
    if (!dirPath || dirPath.trim() === '') {
      // Silently return empty array for empty paths
      return []
    }
    
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const items = []
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      let stats = null
      
      try {
        stats = await fs.stat(fullPath)
      } catch (error) {
        // Skip files we can't access
        continue
      }
      
      const item = {
        name: entry.name,
        path: fullPath,
        isDirectory: entry.isDirectory(),
        size: stats ? stats.size : 0,
        modified: stats ? stats.mtime : null,
        extension: entry.isDirectory() ? '' : path.extname(entry.name).toLowerCase()
      }
      
      // Determine if it's a media file
      const mediaExtensions = {
        video: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpg', '.mpeg'],
        audio: ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a', '.opus'],
        image: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.ico', '.tiff']
      }
      
      item.mediaType = null
      for (const [type, extensions] of Object.entries(mediaExtensions)) {
        if (extensions.includes(item.extension)) {
          item.mediaType = type
          break
        }
      }
      
      items.push(item)
    }
    
    // Sort: directories first, then by name
    items.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1
      if (!a.isDirectory && b.isDirectory) return 1
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    })
    
    return items
  } catch (error) {
    console.error('Error reading directory:', error)
    return []
  }
})

ipcMain.handle('get-path-info', async (event, filePath) => {
  try {
    const stats = await fs.stat(filePath)
    return {
      exists: true,
      isDirectory: stats.isDirectory(),
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime
    }
  } catch (error) {
    return {
      exists: false,
      error: error.message
    }
  }
})

ipcMain.handle('open-file', async (event, filePath) => {
  try {
    await shell.openPath(filePath)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})

ipcMain.handle('show-item-in-folder', async (event, filePath) => {
  try {
    shell.showItemInFolder(filePath)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
})