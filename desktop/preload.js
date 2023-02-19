const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    setChats: (data) => ipcRenderer.send('set-chats', data),
    getChats: (data) => ipcRenderer.send('get-chats', data),
    setKey: (key) => ipcRenderer.send('set-key', key),
    getKey: (key) => ipcRenderer.send('get-key', key),
    "api": {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["key", "chats"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["key", "chats"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
})