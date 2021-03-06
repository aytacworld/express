# @Aytacworld/express-database-mongo

This module contains the database models(Schema) for [@aytacworld/express-login](https://www.npmjs.com/package/@aytacworld/express-login) and [@aytacworld/express-oauth](https://www.npmjs.com/package/@aytacworld/express-oauth).

When requiring just past in the connectionstring to your mongoDB Server.

You can also use mongo as your session storage.

## Installation

using npm

`npm i @aytacworld/express-database-mongo`

using yarn

`yarn add @aytacworld/express-database-mongo`

## Usage

app.js
```javascript
...
const ExpressDatabase = require('@aytacworld/express-database-mongo')('appname', 'mongodb://localhost:27017/auth', 'sessionDbName', 'sessionCollectionName');

const app = new Express({
  ...
  authDatabase: ExpressDatabase,
  // If you want to use mongo Session storage, add the following
  sessionStore: ExpressDatabase.sesstionStore
  ...
});
```

## Schemas and Methods

### Users
#### Schema
```js
{
  username: String,
  password: String
}
```
#### Methods
```js
{
  static findById(id): Promise<user>;
  static findByUsername(username): Promise<user>;
  static comparePassword(username, password): Promise<user|false>;
  static updateUser(username, password): Promise<void>;
  static addUser(username, password): Promise<void>;
  static deleteUser(username): Promise<void>;
}
```
### Clients
#### Schema
```js
{
  name: String,
  clientId: String,
  clientSecret: String,
  redirectUrl: String,
  isTrusted: Boolean,
}
```
#### Methods
```js
{
  static findById(id): Promise<client>;
  static findByClientId(clientId): Promise<client>;
  static compareSecret(username, secret): Promise<client|false>;
  static updateClient(clientId, name, secret, redirectUrl, isTrusted): Promise<void>;
  static addClient(clientId, name, secret, redirectUrl, isTrusted): Promise<void>;
  static deleteClient(clientId): Promise<void>;
}
```

### Accesstokens
#### Schema
```js
{
  token: String,
  userId: String,
  clientId: String,
}
```
#### Methods
```js
{
  static find(key): Promise<accesstoken>;
  static findByUserIdAndClientId(userId, clientId): Promise<accesstoken>;
  static save(token, userId, clientId): Promise<void>;
}
```

### AuthorizationCode
#### Schema
```js
{
  code: String,
  userId: String,
  clientId: String,
  redirectUri: String,
}
```
#### Methods
```js
{
  static find(key): Promise<authorizationcode>;
  static save(code, clientId, redirectUri, userId): Promise<void>;
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
