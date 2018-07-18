# @aytacworld/express-login

This module is ment to be used with @aytacworld/express.

It will add passport local authentication.

## IMPORTANT

The verify method uses plain password, so be carefull. And do not use it in production. Hashing will be added in the future.

## Installation

using npm

`npm i @aytacworld/express-login`

using yarn

`yarn add @aytacworld/express-login`

## Usage

app.js
```javascript
const Express = require('@aytacworld/express');
const app = new Express({
...
  login: require('@aytacworld/express-login'),
  authDatabase: require('./my-auth-database')
...
});
...
```

## Database structure

```javascript
{
  users: {
    static findById(id): Promise,
    static findByUsername(username): Promise
  }
}
```

User structure
```javascript
{
  id: string/ObjectId, // Unique identifier for the user
  username: string, // Username, be sure to check the uniqueness of the username
  password: string // The password field is plain text, so you have been warned.
}
```

## Example user database (in Memory)

```javascript
const records = {
  '1': {id:'1', username:'bob', password:'secret'},
  '2': {id:'2', username:'jake', password:'blablabla'}
};
class Users {
  static async findById(id) {
     return new Promise((res, rej) => records[id] ? res(records[id]) : rej(new Error('User ' + id + ' does not exist')));
  }

  static async findByUsername(username) {
    return new Promise((res) => {
      for (const id in records) {
        if (records[id].username === username) {
          return res(records[id]);
        }
      }
      return res();
    });
  }
}

module.exports = { users: Users };
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
