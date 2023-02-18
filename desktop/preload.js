const { contextBridge } = require('electron')
contextBridge.exposeInMainWorld('electronAPI', {
    sendMessageToMainProcess: (channel, payload) => ipcRenderer.invoke(channel, payload),
})