const { Schema } = require('mongoose');

const AccessTokenSchema = new Schema({
  token: { type: String, required: true },
  userId: { type: String, required: true },
  clientId: { type: String, required: true },
});

function createSchema(conn) {
  const AccessToken = conn.model('AccessToken', AccessTokenSchema);

  class AccessTokenCollection {
    static find(key) {
      return new Promise((resolve, reject) => {
        AccessToken.findOne({ token: key })
          .exec((err, token) => {
            if (err) return reject(err);
            if (!token) return reject(new Error('Token Not Found'));
            return resolve(token);
          });
      });
    }

    static findByUserIdAndClientId(userId, clientId) {
      return new Promise((resolve, reject) => {
        AccessToken.findOne({ userId, clientId })
          .exec((err, token) => {
            if (err) return reject(err);
            if (!token) return reject(new Error('Token Not Found'));
            return resolve(token);
          });
      });
    }

    static save(token, userId, clientId) {
      return new Promise((resolve, reject) => {
        const item = new AccessToken({ token, userId, clientId });
        item.save((err) => {
          if (err) return reject(err);
          return resolve();
        });
      });
    }
  }

  return AccessTokenCollection;
}

module.exports = createSchema;
