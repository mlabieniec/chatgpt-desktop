const { BrowserWindow } = require('electron');
const authService = require('../services/auth');
const createAppWindow = require('./app');

let win = null;

function createAuthWindow() {
  destroyAuthWin();
  win = new BrowserWindow({
    width: 600,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      enableRemoteModule: false
    }
  });

  const authUrl = authService.getAuthenticationURL();
  console.log('loading auth url: ', authUrl);
  win.loadURL(authUrl);
  
  const {session: {webRequest}} = win.webContents;

  const filter = {
    urls: [
      'http://localhost/callback*'
    ]
  };

  webRequest.onBeforeRequest(filter, async ({url}) => {
    await authService.loadTokens(url);
    createAppWindow();
    return destroyAuthWin();
  });

  win.on('authenticated', () => {
    destroyAuthWin();
  });

  win.on('closed', () => {
    win = null;
  });
}

function destroyAuthWin() {
  if (!win) return;
  win.close();
  win = null;
}

function createLogoutWindow() {
  const logoutWindow = new BrowserWindow({
    show: false,
  });

  logoutWindow.loadURL(authService.getLogOutUrl());

  logoutWindow.on('ready-to-show', async () => {
    await authService.logout();
    logoutWindow.close();
  });
}

module.exports = {
  createAuthWindow,
  createLogoutWindow,
};