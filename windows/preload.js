const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  platform: process.platform,
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  getBackendStatus: () => ipcRenderer.invoke('get-backend-status'),
  onSystemEvent: (callback) => ipcRenderer.on('system-event', (event, data) => callback(data)),
});
