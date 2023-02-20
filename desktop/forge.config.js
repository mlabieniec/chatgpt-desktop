module.exports = {
  packagerConfig: {
    'icon': './icon.icns',
    'name': 'My ChatGPT',
    'ignore': './node_modules',
    'version': '1.0.1',
    'version-string':{
      'CompanyName': 'AppXen',
      'FileDescription': 'Chat with OpenAI',
      'OriginalFilename': 'mychatgpt',
      'ProductName': 'My ChatGPT',
      'InternalName': 'mychatgpt'
    }
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: "Michael Labieniec",
        description: "A ChatGPT application"
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {},
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {},
    },
    {
      name: '@electron-forge/maker-pkg',
      config: {
        keychain: 'my-secret-ci-keychain'
      }
    }
  ],
};
