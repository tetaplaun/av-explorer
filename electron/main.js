const { app, BrowserWindow, ipcMain, shell } = require('electron')
const path = require('path')
const fs = require('fs').promises
const { exec } = require('child_process')
const { promisify } = require('util')
const execPromise = promisify(exec)
const isDev = process.env.NODE_ENV === 'development'

let mainWindow

// Drive cache to avoid repeated detection attempts
let driveCache = {
  drives: [],
  timestamp: 0,
  cacheTime: 30000, // Cache for 30 seconds
  errorLogged: false // Track if we've logged an error this session
}

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
    // Check cache first
    const now = Date.now()
    if (driveCache.drives.length > 0 && (now - driveCache.timestamp) < driveCache.cacheTime) {
      return driveCache.drives
    }

    let drives = []
    
    // Method 1: Try fsutil (fastest and most reliable)
    try {
      const { stdout } = await execPromise('fsutil fsinfo drives', { 
        timeout: 2000, 
        windowsHide: true 
      })
      
      // Parse output like "Drives: C:\ D:\ E:\"
      const driveLetters = stdout.match(/[A-Z]:\\/g) || []
      
      for (const driveLetter of driveLetters) {
        const letter = driveLetter[0]
        
        // Try to get drive info with wmic (faster than PowerShell)
        let freeSpace = 0
        let totalSize = 0
        
        try {
          const wmicCmd = `wmic logicaldisk where caption="${letter}:" get size,freespace /value`
          const { stdout: wmicOut } = await execPromise(wmicCmd, { 
            timeout: 1000, 
            windowsHide: true 
          })
          
          const sizeMatch = wmicOut.match(/Size=(\d+)/)
          const freeMatch = wmicOut.match(/FreeSpace=(\d+)/)
          
          if (sizeMatch) totalSize = parseInt(sizeMatch[1])
          if (freeMatch) freeSpace = parseInt(freeMatch[1])
        } catch {
          // Size info failed, but drive still exists
        }
        
        drives.push({
          name: `${letter}:`,
          path: `${letter}:\\`,
          type: 'drive',
          freeSpace,
          totalSize
        })
      }
      
      // Cache successful result
      driveCache.drives = drives
      driveCache.timestamp = now
      driveCache.errorLogged = false
      
      return drives
    } catch (error) {
      // fsutil failed, try next method
      if (!driveCache.errorLogged && isDev) {
        console.log('fsutil method failed, trying fallback methods')
        driveCache.errorLogged = true
      }
    }
    
    // Method 2: Try PowerShell (if fsutil failed)
    try {
      const psCmd = 'powershell -NoProfile -NonInteractive -ExecutionPolicy Bypass -Command "Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{Name=\'FreeSpace\';Expression={$_.Free}}, @{Name=\'TotalSize\';Expression={$_.Used + $_.Free}} | ConvertTo-Json"'
      const { stdout } = await execPromise(psCmd, { 
        timeout: 3000, 
        windowsHide: true, 
        maxBuffer: 5 * 1024 * 1024 
      })
      
      const drivesData = JSON.parse(stdout)
      const drivesList = Array.isArray(drivesData) ? drivesData : [drivesData]
      
      drives = []
      for (const drive of drivesList) {
        if (drive.Name && drive.Name.length === 1) {
          drives.push({
            name: drive.Name + ':',
            path: drive.Name + ':\\',
            type: 'drive',
            freeSpace: drive.FreeSpace || 0,
            totalSize: drive.TotalSize || 0
          })
        }
      }
      
      // Cache successful result
      driveCache.drives = drives
      driveCache.timestamp = now
      driveCache.errorLogged = false
      
      return drives
    } catch (error) {
      // PowerShell also failed
      if (!driveCache.errorLogged && isDev) {
        console.log('PowerShell method failed, using filesystem detection')
        driveCache.errorLogged = true
      }
    }
    
    // Method 3: Fallback to filesystem checking
    drives = []
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
    
    // Cache the result even if it's from fallback
    driveCache.drives = drives
    driveCache.timestamp = now
    
    return drives
  } else {
    // For Unix-like systems, return root
    return [{
      name: 'Root',
      path: '/',
      type: 'drive'
    }]
  }
})

// Add method to refresh drive cache
ipcMain.handle('refresh-drives', async () => {
  // Clear the cache to force refresh
  driveCache.timestamp = 0
  driveCache.drives = []
  
  // Now get fresh drive list
  return await ipcMain._events['get-drives'][0]()
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
