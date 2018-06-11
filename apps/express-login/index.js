const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

class Login {
  constructor(db, useOauthServer) {
    passport.use(new LocalStrategy(this.verify(db.users.findByUsername, 'password')));

    passport.serializeUser((user, cb) => cb(null, user.id));

    passport.deserializeUser((id, cb) => db.users.findById(id, (err, user) => cb(err, user)));

    if (useOauthServer) {
      passport.use(new BasicStrategy(this.verify(db.clients.findByClientId, 'clientSecret')));

      passport.use(new ClientPasswordStrategy(this.verify(db.clients.findByClientId, 'clientSecret')));

      passport.use(new BearerStrategy(
        (accessToken, done) => {
          db.accessTokens.find(accessToken, (error, token) => {
            if (error) return done(error);
            if (!token) return done(null, false);
            if (token.userId) db.users.findById(token.userId, this.bearerCallback(done));
            else db.clients.findByClientId(token.clientId, this.bearerCallback(done));
          });
        }
      ));
    }
  }

  verify(findFunction, secretField) {
    return (id, secret, done) => {
      findFunction(id, (error, record) => {
        if (error) return done(error);
        if (!record) return done(null, false);
        if (record[secretField] !== secret) return done(null, false);
        return done(null, record);
      });
    };
  }

  bearerCallback(done) {
    return (error, consumer) => {
      if (error) return done(error);
      if (!consumer) return done(null, false);
      done(null, consumer, { scope: '*' });
    }
  }
}

module.exports = {
  Login,
  passport
}
