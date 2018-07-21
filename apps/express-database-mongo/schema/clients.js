const { Schema } = require('mongoose');

const ClientSchema = new Schema({
  name: { type: String, required: true, trim: true },
  clientId: { type: String, required: true, trim: true, unique: true },
  clientSecret: { type: String, required: true },
  redirectUrl: { type: String, required: true },
  isTrusted: Boolean,
});

function createSchema(conn) {
  const Client = conn.model('Client', ClientSchema);

  class ClientCollection {
    static findById(id) {
      return new Promise((resolve, reject) => {
        Client.findById(id)
          .exec((err, client) => {
            if (err) return reject(err);
            if (!client) return reject(new Error('Client Not Found'));
            return resolve(client);
          });
      });
    }

    static findByClientId(clientId) {
      return new Promise((resolve, reject) => {
        Client.findOne({ clientId })
          .exec((err, client) => {
            if (err) return reject(err);
            if (!client) return reject(new Error('Client Not Found'));
            return resolve(client);
          });
      });
    }
  }

  return ClientCollection;
}

module.exports = createSchema;
