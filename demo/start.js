const path = require('path');
const Express = require('../apps/express');
const ExpressLogin = require('../apps/express-login');
const ExpressOauth = require('../apps/express-oauth');

const db = require('../apps/express-database-memory')();
const mainRoute = require('./route/mainroute');

const PORT = 3000;

db.clients.addClient('myid-123', 'my awesome app', 'abc123', 'https://www.duckduckgo.com', true);
db.users.addUser('jack', 'secret');

const app = new Express({
  templatePath: path.resolve(__dirname, 'views'),
  routes: [
    { route: '/', path: mainRoute },
  ],
  staticPath: { route: '/public', path: path.resolve(__dirname, 'public') },
  login: ExpressLogin,
  oauthServer: { route: '/auth', module: ExpressOauth },
  authDatabase: db,
});

app.listen(PORT);
