const oauth2orize = require('oauth2orize');
const passport = require('passport');
const login = require('connect-ensure-login');
const express = require('express');

const router = express.Router();

class Private {
  static getUid(length) {
    let uid = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;

    for (let i = 0; i < length; i += 1) {
      uid += chars[this.getRandomInt(0, charsLength - 1)];
    }

    return uid;
  }

  /**
   * Return a random int, used by `Private.getUid()`.
   *
   * @param {Number} min
   * @param {Number} max
   * @return {Number}
   * @api private
   */
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

class OAuth2 {
  constructor(db) {
    this.db = db;

    const server = oauth2orize.createServer();

    server.serializeClient((client, done) => done(null, client.id));

    server.deserializeClient(async (id, done) => {
      try {
        done(null, await this.db.clients.findById(id));
      } catch (err) {
        done(err);
      }
    });

    server.grant(oauth2orize.grant.code(async (client, redirectUri, user, ares, done) => {
      const code = Private.getUid(16);
      try {
        await this.db.authorizationCodes.save(code, client.id, redirectUri, user.id);
        done(null, code);
      } catch (err) {
        done(err);
      }
    }));

    server.grant(oauth2orize.grant.token(async (client, user, ares, done) => {
      const token = Private.getUid(256);
      try {
        await this.db.accessTokens.save(token, user.id, client.clientId);
        done(null, token);
      } catch (err) {
        done(err);
      }
    }));

    server.exchange(oauth2orize.exchange.code(async (client, code, redirectUri, done) => {
      try {
        const authCode = await this.db.authorizationCodes.find(code);
        if (client.id !== authCode.clientId
          || redirectUri !== authCode.redirectUri) done(null, false);
        else {
          const token = Private.getUid(256);
          await this.db.accessTokens.save(token, authCode.userId, authCode.clientId);
          done(null, token);
        }
      } catch (err) {
        done(err);
      }
    }));

    server.exchange(oauth2orize.exchange.password(
      async (client, username, password, scope, done) => {
        try {
          // Validate the client
          let match = await this.db.clients.compareSecret(client.clientId, client.clientSecret);
          if (!match) done(null, false);
          else {
            // Validate the user
            match = await this.db.users.comparePassword(username, password);
            if (!match) done(null, false);
            else {
              // Everything validated, return the token
              const token = Private.getUid(256);
              await this.db.accessTokens.save(token, match.id, client.clientId);
              done(null, token);
            }
          }
        } catch (err) {
          done(err);
        }
      },
    ));

    server.exchange(oauth2orize.exchange.clientCredentials(async (client, scope, done) => {
      try {
        // Validate the client
        const match = await this.db.clients.compareSecret(client.clientId, client.clientSecret);
        if (!match) done(null, false);
        else {
          // Everything validated, return the token
          const token = Private.getUid(256);
          // Pass in a null for user id since there is no user with this grant type
          await this.db.accessTokens.save(token, null, client.clientId);
          done(null, token);
        }
      } catch (err) {
        done(err);
      }
    }));

    this.server = server;
  }

  routes() {
    router.get('', this.authorization());
    router.post('/decision', this.decision());
    router.post('/token', this.token());

    return router;
  }

  authorization() {
    return [
      login.ensureLoggedIn(),
      this.server.authorization(async (clientId, redirectUrl, done) => {
        try {
          const client = await this.db.clients.findByClientId(clientId);
          if (!redirectUrl || client.redirectUrl !== redirectUrl) throw new Error('redirectUrl doesnot exist');
          done(null, client, redirectUrl);
        } catch (err) {
          done(err);
        }
      }, async (client, user, done) => {
        // Check if grant request qualifies for immediate approval
        // Auto-approve
        if (client.isTrusted) done(null, true);
        else {
          const token = await this.db.accessTokens
            .findByUserIdAndClientId(user.id, client.clientId);
          // Auto-approve // Otherwise ask user
          done(null, Boolean(token));
        }
      }),
      (request, response) => {
        response.render('dialog', { transactionId: request.oauth2.transactionID, user: request.user, client: request.oauth2.client });
      },
    ];
  }

  decision() {
    return [
      login.ensureLoggedIn(),
      this.server.decision((req, done) => done(null, { state: req.body.state })),
    ];
  }

  token() {
    return [
      passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
      this.server.token(),
      this.server.errorHandler(),
    ];
  }
}

module.exports = OAuth2;
