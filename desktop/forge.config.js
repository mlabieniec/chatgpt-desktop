module.exports = {
  packagerConfig: {},
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
      name: '@electron-forge/maker-appx',
      config: {
        publisher: 'CN=716593F8-AD51-48ED-A55C-B92CD1EE76D3',
        devCert: 'C:\Users\micha\AppData\Roaming\electron-windows-store\716593F8-AD51-48ED-A55C-B92CD1EE76D3\716593F8-AD51-48ED-A55C-B92CD1EE76D3.pfx',
      }
    }
  ],
};
