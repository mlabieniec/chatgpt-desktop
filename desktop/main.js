const { BrowserWindow, app, ipcMain } = require('electron')
const path = require('path')
const { readFile, writeFile } = require('node:fs/promises')
const { resolve } = require('node:path')
const { Buffer } = require('node:buffer')

let mainWindow = null
let preferences = {
  apiKey: '',
  chats: {
    "1": []
  }
};

const createWindow = () => {

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  ipcMain.on('set-chats', (event, data) => {
    preferences.chats = data
    return rwPref(preferences)
  })
  ipcMain.on('set-key', (event, key) => {
    preferences.chat = key
    return rwPref(preferences)
  })
  ipcMain.on('get-key', (event, key) => {
    mainWindow.webContents.send("key", preferences)
  })
  ipcMain.on('get-chats', (event, key) => {
    mainWindow.webContents.send("chats", preferences.chats)
  })

  mainWindow.on('close', event => {
    mainWindow = null
  })
  mainWindow.loadFile('index.html')
  // development
  //mainWindow.loadURL('http://localhost:3000')
  //mainWindow.webContents.openDevTools()
}

const rwPref = async (update) => {
  const userData = app.getPath("userData")
  const prefPath = resolve(userData + '/data.json')
  if (update) {
    //console.log('updating preferences: ', update)
    try {
      const result = await writeFile(prefPath, JSON.stringify(preferences))
      return console.log("updated preferences")
    } catch(error) {
      console.log("Failed to update preferences")
      console.log(error)
    }
  }
  
  try {
    console.log('loading preferences...')
    const contents = await readFile(prefPath, { encoding: 'utf8' })
    preferences = JSON.parse(contents)
    //console.log('loaded preferences: ', preferences)
    mainWindow.webContents.send("fromMain", preferences.apiKey)
  } catch(error) {
    switch(error.code) {
      case 'ENOENT':
        console.log('no preferences found, creating default')
        const result = await writeFile(prefPath, JSON.stringify(preferences))
        return rwPref()
      default:
        console.log(error)
        break
    }
  }
}

app.whenReady().then(() => {
  createWindow()
  rwPref()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})