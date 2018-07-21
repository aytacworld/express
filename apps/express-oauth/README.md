# @Aytacworld/express-oauth

This module is ment to be used with @aytacworld/express.

It will add oauth capabilities.

## Installation

using npm

`npm i @aytacworld/express-oauth`

using yarn

`yarn add @aytacworld/express-oauth`

## Usage

app.js
```javascript
const app = new Express({
  ...
  oauthServer: {route: '/auth', module: require('@aytacworld/express-oauth')},
  authDatabase: require('./my-auth-database')
  ...
});
```

## Database structure

```javascript
{
  users: {
    static comparePassword(username, password): Promise<user|false>;
  },
  clients: {
    static findById(id): Promise<client>;
    static findByClientId(clientId): Promise<client>;
    static compareSecret(username, secret): Promise<client|false>;
  },
  accessTokens: {
    static find(key): Promise<accesstoken>;
    static findByUserIdAndClientId(userId, clientId): Promise<accesstoken>;
    static save(token, userId, clientId): Promise<void>;
  },
  authorizationCodes: {
    static find(key): Promise<authorizationcode>;
    static save(code, clientId, redirectUri, userId): Promise<void>;
  }
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
