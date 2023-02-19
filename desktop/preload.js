const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setPreferences: (data) => ipcRenderer.send('set-preferences', data),
    getPreferences: (data) => ipcRenderer.send('get-preferences', data),
    setKey: (key) => ipcRenderer.send('set-key', key),
    getKey: (key) => ipcRenderer.send('get-key', key),
    "api": {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["fromMain"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
})