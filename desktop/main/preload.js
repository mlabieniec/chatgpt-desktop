const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    getProfile: () => ipcRenderer.invoke('auth:get-profile'),
    logOut: () => ipcRenderer.send('auth:log-out'),
    getImage: (data) => ipcRenderer.invoke('api:image', data),
    getText: (data) => ipcRenderer.invoke('api:text', data),
    setChats: (data) => ipcRenderer.send('set-chats', data),
    getChats: (data) => ipcRenderer.send('get-chats', data),
    openSave: (data) => ipcRenderer.send('open-save', data),
    setKey: (key) => ipcRenderer.send('set-key', key),
    getKey: (key) => ipcRenderer.send('get-key', key),
    "api": {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["key", "chats", "save"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["key", "chats", "save"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
})