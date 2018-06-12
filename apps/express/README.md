# @Aytacworld/express

With this module, you don't need to rewrite the express boilerplate over and over again.

Just pass your routes.

## Installation

using npm

`npm i @aytacworld/express`

using yarn

`yarn add @aytacworld/express`

## Usage

router.js
```javascript
const router = require('express').Router();
router.get('/some-page', (req, res) => res.render('some-pug-file'));
module.exports = router;
```

app.js
```javascript
const path = require('path')
const Express = require('@aytacworld/express');
const app = new Express({
  templatePath: path.resolve(__dirname, 'views'),
  routes: [
    {route: '/', path: require('./router.js')}
  ],
  staticPath: {route: 'public', path: path.resolve(__dirname, 'public-folder')}
});
app.listen(process.env.PORT);
// you can also pass http options
// this method is the same as require('http').createServer(this.app).listen(httpOptions);
```

## Options

```javascript
{
  templatePath: string, // This is the path to pug files, default './'
  routes: Array<{route: string, path: require}>, // This list contains the routing information, default []
  staticPath: {route: string, path: require}, // This is the path to static files, default false
  login: require('@aytacworld/express-login'), // This is the passport module to require, default false
  oauthServer: {route: string, module: require('@aytacworld/express-oauth')}, // This is the oauth serverside part, default false,
  authDatabase: Database object, // This is the auth database to make the login/oauth token exchange happen, it is mandatory if you use login and/or oauthServer, default false
  authDecisionPage: string // This is the path to decisions pug file
}
```

## MIT License

Copyright (c) 2018 Adem Aytaç

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
