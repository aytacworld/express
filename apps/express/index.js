const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const errorHandler = require('errorhandler');
const cors = require('cors');
const helmet = require('helmet');

module.exports = class Express {
  constructor(options = {}) {

    let oauth = undefined;
    const viewLocations = [];

    // Checking options
    options.templatePath = options.templatePath || './';
    options.routes = options.routes || [];
    options.staticPath = options.staticPath || false;
    options.login = options.login || false;
    options.oauthServer = options.oauthServer || false;
    options.authDatabase = options.authDatabase || false;
    options.authDecisionPage = options.authDecisionPage || undefined;

    if (options.login) {
      new options.login.Login(options.authDatabase, Boolean(options.oauthServer));
    }

    if (options.oauthServer) {
      oauth = new options.oauthServer.module(options.authDatabase);
      options.routes.push({ route: options.oauthServer.route, path: oauth.routes() });
      viewLocations.push(options.authDecisionPage);
    }

    const app = express();

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(errorHandler());
    app.use(expressSession({ secret: this.randomSecret(), resave: false, saveUninitialized: false }));
    app.use(cors());
    app.use(helmet())
    app.options('*', cors());

    if (Boolean(options.login)) {
      app.use(options.login.passport.initialize());
      app.use(options.login.passport.session());
    }

    if (Boolean(options.templatePath)) {
      viewLocations.push(options.templatePath);
      app.set('views', viewLocations);
      app.set('view engine', 'pug');
    }

    for (let i = 0; i < options.routes.length; i++) {
      const route = options.routes[i];
      app.use(route.route, route.path);
    }
    if (Boolean(options.staticPath)) {
      app.use(options.staticPath.route, express.static(options.staticPath.path));
    }

    app.get('*', (req, res) => res.status(404).send('Not Found'));

    this.app = app;
  }

  listen(httpOptions, cb = () => { console.log('port', httpOptions) }) {
    require('http').createServer(this.app).listen(httpOptions, cb);
  }

  randomSecret(charQuantity = Math.floor(Math.random() * 20)) {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < charQuantity; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }
}
