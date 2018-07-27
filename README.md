# @Aytacworld

This repo contains the following packages

- @aytacworld/express
  Eliminating default express boilerplate code
- @aytacworld/express-login
  Adding passport functionality
- @aytacworld/express-oauth
  Adding a oauth server code
- @aytacworld/express-database-mongo
  Database needed for login and oauth plugins using mongodb as database
- @aytacworld/express-database-memory (!!! DO NOT USE IN PRODUCTION)
  Database needed for login and oauth plugins using in-memory as database

## Demo

### Default

To run the default demo with in-memory-storage, run `yarn start`.

This demo will run the application without external db.

### Mongo

To run the mongo demo, run `yarn start:mongo`.

This demo needs a mongodb server running on localhost:__28018__.

There is a docker-compose to run mongodb server, you can spin it up by running `yarn mongo:up`,
and kill it by running `yarn mongo:down`.

## TODO

- testing
- @aytacworld/express
  - implement authDecisionPage logic
- @aytacworld/express-database-mongo
  - add applications collection
  - ask for application name when initiating the db connection
  - external addApp will add the application name in the users applications list, and with extra parameter to create the user if it doesn’t exists.
  - delete expired tokens
  - add refresh token stuff, so the user can recreate access tokens
- @aytacworld/express-oauth-admin
  - this is a new project to maintain the oauth administration

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
