const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('system', {
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  shutdownNow: () => ipcRenderer.invoke('shutdown-now'),
  scheduleShutdown: (timestamp) => ipcRenderer.invoke('schedule-shutdown', timestamp),
  cancelShutdown: (id) => ipcRenderer.invoke('cancel-shutdown', id),
  windowMinimize: () => ipcRenderer.invoke('window-minimize'),
  windowClose: () => ipcRenderer.invoke('window-close'),
  getLang: () => ipcRenderer.invoke('get-lang'),
  setLang: (lang) => ipcRenderer.invoke('set-lang', lang)
});
