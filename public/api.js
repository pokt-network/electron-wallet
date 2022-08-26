const { contextBridge, ipcRenderer } = require('electron');

// expose the electron ipcRenderer API to the global window object
contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);
