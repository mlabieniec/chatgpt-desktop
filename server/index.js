const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const envVariables = require('dotenv').config({path: './.env'}).parsed;
const app = express();
const { Configuration, OpenAIApi } = require("openai");
//app.get('/public', (req, res) => res.send('Everyone in the world can read this message.'));

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
  apiKey: envVariables.openaiApiKey,
});
const openai = new OpenAIApi(configuration);

app.post('/text', async (req, res) => {
  const newMsg = req.body.message;
  try {
    let response = response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `
I want you to reply to all my questions in markdown format. 
Q: ${newMsg}?.
A: `,
        temperature: 0.5,
        max_tokens: 1024,
        //top_p: 0.5,
        frequency_penalty: 0.5,
        presence_penalty: 0.2,
      })
    result = response.data;
    res.json(result);
  } catch (error) {
    result = { "error": error + ". Is your API Key Correct?" }
    res.send(result)
  }
});

app.listen(3001, () => console.log('Example app listening on port 3001!'));