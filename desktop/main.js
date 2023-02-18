const { BrowserWindow, app } = require('electron')
const { fork } = require("child_process");

let mainWindow = null

function main() {
  
  let ps;
  //...
  ps = fork(`${__dirname}/server/server.js`, [], {
    cwd: `${__dirname}/../`,
  });

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
  mainWindow.webContents.openDevTools()
}

app.on('ready', main)