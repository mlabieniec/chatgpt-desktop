# ChatGPT clone with DALL.E image generation model

An electron/desktop application for ChatGPT clone.

> a demo of the App
<img src="_pics/demo.gif" width="800px" alt="android icon"/>

**Give it a ⭐ if you liked it 😜**

## install

### client
```bash
cd desktop/client && npm i
```

## Configuration
1. obtain your openai api key from [here](https://openai.com)
2. enter it into the app and start chatting. *it will be stored only in memory and not saved across sessions

### Client Development
1. `cd client`
2. `npm start`

## build
```bash
cd client && npm run build
```

Then update `desktop/index.html` CSS and JS files to point to updated `desktop/client/build` files. Then use forge to build.

```bash
cd desktop && npm run package
```

### to run client only in the browser
```bash
cd client
npm start
```

***Tech used***
  - openai API
  - react
  - tailwindcss
  - react-icons
  - react-markdown
  - redis
  - express


## credits
- [OpenAI](https://openai.com) for creating [ChatGPT](https://chat.openai.com/chat)
- [eyucoder](https://github.com/eyucoder/chatgpt-clone) for creating initial react client

## 📝 License

>This project is released under the Apache License 2.0 license.
See [LICENSE](./LICENSE) for details.
