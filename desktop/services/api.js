const axios = require('axios');
const authService = require('./auth');
const envVariables = require('../env');
const { Logger } = require('../services/logger');
const env = process.env.NODE_ENV || 'production'
const apiUrl = envVariables[env].apiUrl;
Logger.log('apiUrl: ', apiUrl);
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
  getImage
}