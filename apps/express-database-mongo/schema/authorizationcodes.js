const { Schema } = require('mongoose');

const AuthorizationCodeSchema = new Schema({
  code: { type: String, required: true, trim: true, unique: true },
  clientId: { type: String, required: true },
  redirectUri: { type: String, required: true },
  userId: { type: String, required: true },
});

function createSchema(conn) {
  const AuthorizationCode = conn.model('AuthorizationCode', AuthorizationCodeSchema);

  class AuthorizationCodeCollection {
    static find(key) {
      return new Promise((resolve, reject) => {
        AuthorizationCode.findOne({ code: key })
          .exec((err, code) => {
            if (err) return reject(err);
            if (!code) return reject(new Error('Code Not Found'));
            return resolve(code);
          });
      });
    }

    static save(code, clientId, redirectUri, userId) {
      return new Promise((resolve) => {
        const item = new AuthorizationCode({ code, clientId, redirectUri, userId });
        item.save((err) => {
          if (err) return reject(err);
          return resolve();
        });
      });
    }
  }

  return AuthorizationCodeCollection;
}

module.exports = createSchema;
