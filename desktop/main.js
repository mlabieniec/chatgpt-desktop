const { app } = require('electron')
const { createAuthWindow } = require('./main/auth');
const createAppWindow = require('./main/app');
const authService = require('./services/auth');
const { Logger } = require('./services/logger');

app.commandLine.appendSwitch('ignore-certificate-errors')
app.commandLine.appendSwitch('allow-insecure-localhost', 'true');

const createWindow = async () => {
  try {
    await authService.refreshTokens();
    createAppWindow();
  } catch (err) {
    Logger.log(err);
    createAuthWindow();
  }
}
app.setName('ChatGPT')
app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})