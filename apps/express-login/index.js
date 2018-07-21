const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { BasicStrategy } = require('passport-http');
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

function strategyCallback() {
  return async (clientId, secret, cb) => {
    try {
      cb(null, await db.clients.compareSecret(clientId, secret));
    } catch (err) {
      cb(err);
    }
  };
}

class Login {
  constructor(db, useOauthServer) {
    passport.use(new LocalStrategy(async (username, password, cb) => {
      try {
        cb(null, await db.users.comparePassword(username, password));
      } catch (err) {
        cb(err);
      }
    }));

    passport.serializeUser((user, cb) => cb(null, user.id));

    passport.deserializeUser(async (id, cb) => {
      try {
        cb(null, await db.users.findById(id));
      } catch (err) {
        cb(err);
      }
    });

    if (useOauthServer) {
      passport.use(new BasicStrategy(strategyCallback()));
      passport.use(new ClientPasswordStrategy(strategyCallback()));

      passport.use(new BearerStrategy(async (accessToken, done) => {
        try {
          const token = await db.accessTokens.find(accessToken);
          if (!token) done(null, false);
          else {
            const consumer = token.userId
              ? await db.users.findById(token.userId)
              : await db.clients.findByClientId(token.clientId);
            if (!consumer) done(null, false);
            else done(null, consumer, { scope: '*' });
          }
        } catch (err) {
          done(err);
        }
      }));
    }
  }
}

module.exports = {
  Login,
  passport,
};
