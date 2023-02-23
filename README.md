# ChatGPT app with DALL.E image generation

An electron-based multi-platform desktop application for interacting with OpenAI (Supports davinci and dall.e models).

<img src="_pics/demo.gif" width="100%" alt="Demo"/>

* No servers; desktop based and data stored/saved locally
* Works on any platform (mac, windows, and browser)
* Use your own Openai.com API Key
* Multiple chat rooms for organizing data
* Images are stored locally in user pictures directory
* Download AI responses as Image and Markdown

**Give it a ⭐ if you liked it 😜**

## install

### Running the browser client (dev) and the desktop client
```bash
npm install
npm start
```

The electron client will run and access the react client on localhost:3000 w/auto-reload enabled in the electron app. You can access the browser client directly at http://localhost:3000

> Generated image URLs don't last long. So all images are downloaded and stored locally to a user's home -> pictures directory (path is provided by electron app's 'pictures' path)

> **Local images will not load while in development** since permission to load a local file from `localhost` will be denied. To see the images in the feed you need to `build` first and then run (since this will load a file instead of a url). You can also verify data by checking the local data file's chat message `message.text` property value and/or see the local picture downloaded to the Pictures directory (they will be stored in `${HOME}/Pictures/chatgpt/${chat.id}/${message.id}.png`).

## Configuration
1. obtain your openai api key from [here](https://openai.com)
2. run the app, click API Key, enter it, start chatting. *it will be stored only in memory and not saved across sessions

## Build
```bash
./build.sh
```

You can run electron with the built client files with:

```bash
npm run electron
```

This will load the production build files from the local disk. 

To package a platform release for the platform you are on:
```bash
cd desktop && npm run package
```

or use forge directly (see npm script) with your chosen platform/config.

***Tech used***
  - openai API
  - react
  - electron
  - tailwindcss
  - daisyui
  - react-icons
  - react-markdown


## credits
- [OpenAI](https://openai.com) for creating [ChatGPT](https://chat.openai.com/chat)
- [eyucoder](https://github.com/eyucoder/chatgpt-clone) for creating initial react client

## 📝 License

>This project is released under the Apache License 2.0 license.
See [LICENSE](./LICENSE) for details.
