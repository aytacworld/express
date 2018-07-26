const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const errorHandler = require('errorhandler');
const cors = require('cors');
const helmet = require('helmet');
const http = require('http');

function randomSecret(charQuantity = Math.floor(Math.random() * 20)) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < charQuantity; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

module.exports = class Express {
  constructor(opts = {}) {
    let oauth;
    const viewLocations = [];

    // Checking options
    const options = opts;
    options.templatePath = options.templatePath || './';
    options.routes = options.routes || [];
    options.staticPath = options.staticPath || false;
    options.login = options.login || false;
    options.oauthServer = options.oauthServer || false;
    options.authDatabase = options.authDatabase || false;
    options.authDecisionPage = options.authDecisionPage || undefined;
    options.sessionStore = options.sessionStore || false;

    if (options.login) {
      new options.login.Login(options.authDatabase, Boolean(options.oauthServer)); // eslint-disable-line no-new, max-len
    }

    if (options.oauthServer) {
      oauth = new options.oauthServer.module(options.authDatabase); // eslint-disable-line new-cap
      options.routes.push({ route: options.oauthServer.route, path: oauth.routes() });
      if (options.authDecisionPage) {
        viewLocations.push(options.authDecisionPage);
      }
    }

    const app = express();

    app.use((req, res, next) => {
      console.log(req.method, req.path); // eslint-disable-line no-console
      next();
    });

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(errorHandler());
    const sessionOptions = { secret: randomSecret(), resave: false, saveUninitialized: false };
    if (options.sessionStore) {
      sessionOptions.cookie = { maxAge: 1000 * 60 * 60 * 24 * 7 }; // 1 week
      sessionOptions.store = options.sessionStore.getStore(expressSession);
      sessionOptions.resave = true;
      sessionOptions.saveUninitialized = true;
    }
    app.use(expressSession(sessionOptions));
    app.use(cors());
    app.use(helmet());
    app.options('*', cors());

    if (options.login) {
      app.use(options.login.passport.initialize());
      app.use(options.login.passport.session());
    }

    if (options.templatePath) {
      viewLocations.push(options.templatePath);
      app.set('views', viewLocations);
      app.set('view engine', 'pug');
    }

    for (let i = 0; i < options.routes.length; i += 1) {
      const route = options.routes[i];
      app.use(route.route, route.path);
    }
    if (options.staticPath) {
      app.use(options.staticPath.route, express.static(options.staticPath.path));
    }

    app.get('*', (req, res) => res.status(404).send('Not Found'));

    this.app = app;
  }

  listen(httpOptions, cb = () => { console.log('port', httpOptions); }) { // eslint-disable-line no-console
    http.createServer(this.app).listen(httpOptions, cb);
  }
};
