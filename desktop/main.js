const { BrowserWindow, app } = require('electron')

let mainWindow = null

function main() {

  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
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