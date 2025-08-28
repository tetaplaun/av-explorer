const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  getAppInfo: () => ipcRenderer.invoke('app-info'),
  sendMessage: (channel, data) => {
    const validChannels = ['toMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  onMessage: (channel, func) => {
    const validChannels = ['fromMain']
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args))
    }
  },
  // File System APIs
  fileSystem: {
    getDrives: () => ipcRenderer.invoke('get-drives'),
    readDirectory: (path) => ipcRenderer.invoke('read-directory', path),
    getPathInfo: (path) => ipcRenderer.invoke('get-path-info', path),
    getEncodedDates: (fileItems) => ipcRenderer.invoke('get-encoded-dates', fileItems),
    openFile: (path) => ipcRenderer.invoke('open-file', path),
    showItemInFolder: (path) => ipcRenderer.invoke('show-item-in-folder', path)
  }
})