const { BrowserWindow, app, ipcMain } = require('electron')
const path = require('path')
const { readFile, writeFile } = require('node:fs/promises')
const { resolve } = require('node:path')
const { Buffer } = require('node:buffer')

let mainWindow = null
let preferences = {
  apiKey: ''
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
  ipcMain.on('set-preferences', (event, data) => {
    console.log('set-preferences');
    console.log(event)
    console.log(data)
  })
  ipcMain.on('set-key', (event, key) => {
    //console.log('set-key: ', key)
    preferences.apiKey = key
    return rwPref(preferences)
  })
  ipcMain.on('get-key', (event, key) => {
    //console.log('get-key')
    mainWindow.webContents.send("fromMain", preferences.apiKey)
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
  const prefPath = resolve('./preferences.json')
  if (update) {
    console.log('updating preferences: ', update)
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