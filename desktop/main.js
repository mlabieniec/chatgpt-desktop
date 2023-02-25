const { app } = require('electron')
const { createAuthWindow } = require('./main/auth');
const createAppWindow = require('./main/app');
const authService = require('./services/auth');
const { Logger } = require('./services/logger');

const createWindow = async () => {
  try {
    await authService.refreshTokens();
    createAppWindow();
  } catch (err) {
    Logger.log(err);
    createAuthWindow();
  }
}
app.setName('My Chat GPT')
app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})