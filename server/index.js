const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const envVariables = require('dotenv').config({path: './.env'}).parsed;
const expressWs = require('express-ws')(express());
const app = expressWs.app;
const { Configuration, OpenAIApi } = require("openai");
//app.get('/public', (req, res) => res.send('Everyone in the world can read this message.'));

app.use(express.json());
app.use(jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${envVariables.auth0Domain}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: envVariables.apiIdentifier,
  issuer: `https://${envVariables.auth0Domain}/`,
  algorithms: ['RS256']
}));

const configuration = new Configuration({
  apiKey: envVariables.openaiKey,
});
const openai = new OpenAIApi(configuration);

app.get('/models', async (req, res) => {
  try {
    let response = await openai.listModels()
    result = response.data;
    res.json(result);
  } catch (error) {
    result = { "error": error }
    res.send(result)
  }
})
app.post ('/image', async (req,res) => {
  console.log('[server] request body: ', req.body);
  const newMsg = req.body.text;
  try {
    let response = await openai.createImage({
      prompt: `${newMsg}`,
      n: 1,
      size: "512x512",
    });
    result = response.data;
    res.json(result);
  } catch(error) {
    result = { "error": error }
    res.send(result)
  }
});
app.post('/text', async (req, res) => {
  //console.log('[server] request body: ', req.body);
  const newMsg = req.body.text;
  try {
    let response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `
I want you to reply to all my questions in markdown format. ${newMsg}?.`,
        temperature: 0.2,
        max_tokens: 1024,
        //top_p: 0.5,
        frequency_penalty: 0.5,
        presence_penalty: 0.2,
      })
      /*
      response.data.on("data", (data) => {
        console.log('data: ', data)
        const lines = data
          ?.toString()
          ?.split("\n")
          .filter((line) => line.trim() !== "");
        for (const line of lines) {
          const message = line.replace(/^data: /, "");
          if (message === "[DONE]") {
            break; // Stream finished
          }
          try {
            const parsed = JSON.parse(message);
            console.log(parsed);
          } catch (error) {
            console.error("Could not JSON parse stream message", message, error);
          }
        }
      });
      */
    console.log('[server] response: ', response);
    result = response.data;
    return res.json(result);
  } catch (error) {
    console.log('[server] error: ', error);
    result = { "error": error };
    return res.send(result);
  }
});
app.post('/code', async (req, res) => {
  //console.log('[server] request body: ', req.body);
  const newMsg = req.body.text;
  try {
    /**
     * code-davinci-002
     * Most capable Codex model. 
     * Particularly good at translating natural language 
     * to code. In addition to completing code, also 
     * supports inserting completions within code.
     * 
     * code-cushman-001
     * Almost as capable as Davinci Codex, but slightly 
     * faster. This speed advantage may make it preferable 
     * for real-time applications.
     * 
     * https://platform.openai.com/docs/models/codex
     */
    let response = await openai.createCompletion({
        model: 'text-davinci-002',
        prompt: `
/*
${newMsg}
Comment and explain the code
*/        
`,
        temperature: 0.5,
        max_tokens: 1024,
        frequency_penalty: 0.5,
        presence_penalty: 0.2,
      })
    result = response.data;
    //console.log('[server] response: ', response)
    res.json(result)
  } catch (error) {
    result = { "error": error }
    res.send(result)
  }
});

app.ws('/chat', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

app.listen(3001, () => console.log('Server listening on port 3001!'));