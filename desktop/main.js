const { BrowserWindow, app } = require('electron')
const path = require('path')

let mainWindow = null

function main() {

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })
  mainWindow.on('close', event => {
    mainWindow = null
  })
  mainWindow.loadFile('index.html')
  //mainWindow.webContents.openDevTools()
}

app.on('ready', main)