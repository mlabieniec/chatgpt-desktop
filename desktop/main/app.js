const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { readFile, writeFile } = require('node:fs/promises')
const { resolve } = require('node:path')
const path = require('path')
const fs = require('fs')
const https = require('https')
const env = process.env.NODE_ENV || 'production';
const development = (process.env.NODE_ENV === 'development');
const { Logger } = require('../services/logger');
const authService = require('../services/auth');
const apiService = require('../services/api');

let preferences = {
    apiKey: '',
    chats: {
      "1": [
        {
          id: 1,
          chat: "1",
          createdAt: Date.now(),
          text: '**Hello!** *How can I help you today?*',
          ai: true,
          initial: true
        }
      ]
    }
  };
let mainWindow = null;
function createAppWindow() {
    console.log("starting with NODE_ENV: ", env)
    let win = new BrowserWindow({
        width: 1280,
        height: 900,
        icon: __dirname + '../icon.png',
        title: 'My Chat GPT',
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true
        }
    })
    mainWindow = win;
    ipcMain.handle('auth:get-profile', authService.getProfile);
    ipcMain.handle('api:get-private-data', apiService.getPrivateData);
    ipcMain.on('auth:log-out', async () => {
      BrowserWindow.getAllWindows().forEach(window => window.close());
      const logoutWindow = new BrowserWindow({
        show: false,
      });
      logoutWindow.loadURL(authService.getLogOutUrl());
      logoutWindow.on('ready-to-show', async () => {
        await authService.logout();
        logoutWindow.close();
        app.quit();
      });
    });
    ipcMain.on('set-chats', (event, data) => {
      preferences.chats = data.chats
      return rwPref(data.message)
    })
    ipcMain.on('set-key', (event, key) => {
      preferences.apiKey = key
      return rwPref(preferences)
    })
    ipcMain.on('get-key', (event, key) => {
      mainWindow.webContents.send("key", preferences)
    })
    ipcMain.on('get-chats', (event, key) => {
      mainWindow.webContents.send("chats", preferences.chats)
    })
    ipcMain.on('open-save', async (event, data) => {
      const home = app.getPath('documents')
      if (typeof data === 'string') {
        let result = await dialog.showSaveDialog(mainWindow,{
          defaultPath: "chatgpt.md"
        })
        if (result.filePath) {
          let savePath = resolve(result.filePath)
          const saveResult = await writeFile(savePath, data)
          Logger.log(saveResult)
        } 
      } else if(typeof data === 'object' && data.url) {
        Logger.log('downloading image', data.url)
        let result = await dialog.showSaveDialog(mainWindow, {
          defaultPath: 'image.png'
        })
        // { filePath: '/Users/michael/Documents/image.png', canceled: false }
        if (result.canceled) return Logger.log('Save cancelled')
        https.get(data.url, async (res) => {
            let saveImagePath = resolve(result.filePath)
            const filePath = fs.createWriteStream(saveImagePath);
            res.pipe(filePath);
            filePath.on('finish',() => {
              filePath.close();
              return Logger.log('Download Completed'); 
          })
        })
      }
    })
    if (development) {
        Logger.log('starting in development, trying to load web app from localhost:3000')
        win.loadURL('http://localhost:3000')
        win.webContents.openDevTools()
    } else {
        win.loadFile('./client/index.html')
    }
    win.on('closed', () => {
        win = null;
    });
    rwPref();
    return win;
}

const saveLocalImage = async (message,prefPath) => {
    const picsPath = app.getPath("pictures")
    const saveDirectory = `${picsPath}/chatgpt/${message.chat}`
    Logger.log('Saving local image to: ', saveDirectory)
    if (!fs.existsSync(saveDirectory)) {
      fs.mkdir(saveDirectory, { recursive: true }, error => error ? Logger.log(error) : Logger.log(`${saveDirectory} created`) ) ;
    }
    const saveImagePath = resolve(`${saveDirectory}/${message.id}.png`)
    const url = message.text
    Logger.log('downloading image: ', url)
    https.get(url, async (res) => {
        const filePath = fs.createWriteStream(saveImagePath);
        res.pipe(filePath);
        filePath.on('finish', async () => {
          filePath.close();
          Logger.log('Download Completed: ', saveImagePath); 
          preferences.chats[message.chat].map((v) => {
            if (v.id === message.id) {
              v.text = "file://"+saveImagePath
              Logger.log('updating message ', v.id)
              Logger.log('with ', v.text)
            }
          })
          await writeFile(prefPath, JSON.stringify(preferences))
          return Logger.log('updated data with locally saved image')
      })
    })
  }
  
  const rwPref = async (update) => {
    const userData = app.getPath("userData")
    const prefPath = resolve(userData + '/data.json')
    Logger.log('Loading data.json from: ', prefPath)
    if (update) {
      Logger.log('Running update: ', update)
      try {
        Logger.log('Testing for an image')
        if (update.ai && update.selected === 'DALL·E') {
          Logger.log('message is an image, saving local file')
          await saveLocalImage(update, prefPath)
        } else {
          await writeFile(prefPath, JSON.stringify(preferences))
        }
        return Logger.log("updated local data")
      } catch(error) {
        Logger.log("Failed to update local data")
        return Logger.log(error)
      }
    } else {
      try {
        console.log('loading preferences...')
        const contents = await readFile(prefPath, { encoding: 'utf8' })
        preferences = JSON.parse(contents)
        mainWindow.webContents.send("key", preferences.apiKey)
      } catch(error) {
        switch(error.code) {
          case 'ENOENT':
            Logger.log('no preferences found, creating with default: ', preferences)
            await writeFile(prefPath, JSON.stringify(preferences))
            return rwPref()
          default:
            Logger.log(error)
            break
        }
      }
    }
  }

module.exports = createAppWindow;