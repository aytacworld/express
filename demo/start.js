/* eslint-disable global-require, no-console */
const path = require('path');
const Express = require('../apps/express');
const ExpressLogin = require('../apps/express-login');
const ExpressOauth = require('../apps/express-oauth');

let db = null;
let mongoSessionStore;
if (process.env.DEMO_DB === 'mongo') {
  console.info('Starting Mongo demo');
  db = require('../apps/express-database-mongo')('my-demo-app', 'mongodb://localhost:28018/auth', 'auth');
  mongoSessionStore = db.sessionStore;
} else {
  console.info('Starting default demo');
  db = require('../apps/express-database-memory')();
}

const mainRoute = require('./route/mainroute');
const apiRoute = require('./route/apiroute');

const PORT = 3000;

(async () => {
  try {
    await db.clients.addClient('myid-123', 'my awesome app', 'abc123', 'https://www.duckduckgo.com', true);
  } catch (e) {
    console.log('client already exists');
  }
  try {
    await db.users.addUser('jack', 'secret');
  } catch (e) {
    console.log('user already exists');
  }

  const app = new Express({
    templatePath: path.resolve(__dirname, 'views'),
    routes: [
      { route: '/', path: mainRoute },
      { route: '/api', path: apiRoute },
    ],
    staticPath: { route: '/public', path: path.resolve(__dirname, 'public') },
    login: ExpressLogin,
    oauthServer: { route: '/auth', module: ExpressOauth },
    authDatabase: db,
    sessionStore: mongoSessionStore,
  });

  app.listen(PORT);
})();
