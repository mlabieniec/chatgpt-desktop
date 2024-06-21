const axios = require('axios')
const authService = require('./auth')
const envVariables = require('../env')
const { Logger } = require('../services/logger')
const env = process.env.NODE_ENV || 'production'
const apiUrl = envVariables[env].apiUrl
const { WebSocket } = require('ws')

async function connectWs() {
  let ws = new WebSocket(`ws://${apiUrl.split('//')[1]}/`)
  ws.on("message", (message) => {
    var str = message.toString()
    console.log("Message received: ", str)
    //mainWindow.webContents.send('some-event', str)
 })
}

async function getPrivateData(data) {
  const result = await axios.post(`${apiUrl}/text`, { 'message': 'test' }, {
    headers: {
      'Authorization': `Bearer ${authService.getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return result.data;
}

async function getText(data) {
  const result = await axios.post(`${apiUrl}/text`, data, {
    headers: {
      'Authorization': `Bearer ${authService.getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return result.data;
}

async function getCode(data) {
  Logger.log('[desktop] Getting code: ', data);
  const result = await axios.post(`${apiUrl}/code`, data, {
    headers: {
      'Authorization': `Bearer ${authService.getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return result.data;
}

async function getImage(data) {
  const result = await axios.post(`${apiUrl}/image`, data, {
    headers: {
      'Authorization': `Bearer ${authService.getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  });
  return result.data;
}

module.exports = {
  getPrivateData,
  getText,
  getImage,
  getCode,
  connectWs
}