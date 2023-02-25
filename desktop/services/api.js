const axios = require('axios');
const authService = require('./auth');
const envVariables = require('../env');
const env = process.env.NODE_ENV || 'production'
const apiUrl = envVariables[env].apiUrl;
console.log('apiUrl: ', apiUrl);
async function getPrivateData() {
  const result = await axios.get(`${apiUrl}/private`, {
    headers: {
      'Authorization': `Bearer ${authService.getAccessToken()}`,
    },
  });
  return result.data;
}

module.exports = {
  getPrivateData,
}