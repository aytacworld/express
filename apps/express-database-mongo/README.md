# @Aytacworld/express-database-mongo

This module contains the database models(Schema) for [@aytacworld/express-login](https://www.npmjs.com/package/@aytacworld/express-login) and [@aytacworld/express-oauth](https://www.npmjs.com/package/@aytacworld/express-oauth).

When requiring just past in the connectionstring to your mongoDB Server.

## Installation

using npm

`npm i @aytacworld/express-database-mongo`

using yarn

`yarn add @aytacworld/express-database-mongo`

## Usage

app.js
```javascript
...
const ExpressDatabase = require('@aytacworld/express-database-mongo')('mongodb://localhost:27017/auth');

const app = new Express({
  ...
  authDatabase: ExpressDatabase,
  ...
});
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
