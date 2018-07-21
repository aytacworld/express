const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { BasicStrategy } = require('passport-http');
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

function strategyCallback(findFunc, secretField) {
  return async (id, secret, cb) => {
    try {
      const item = await findFunc(id);
      cb(null, (!item || item[secretField] !== secret) ? false : item);
    } catch (err) {
      cb(err);
    }
  };
}

class Login {
  constructor(db, useOauthServer) {
    // TODO compare the hashed password
    passport.use(new LocalStrategy(strategyCallback(db.users.findByUsername, 'password')));

    passport.serializeUser((user, cb) => cb(null, user.id));

    passport.deserializeUser(async (id, cb) => {
      try {
        cb(null, await db.users.findById(id));
      } catch (err) {
        cb(err);
      }
    });

    if (useOauthServer) {
      passport.use(new BasicStrategy(strategyCallback(db.clients.findByClientId, 'clientSecret')));
      passport.use(new ClientPasswordStrategy(strategyCallback(db.clients.findByClientId, 'clientSecret')));

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
