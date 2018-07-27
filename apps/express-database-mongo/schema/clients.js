const { Schema } = require('mongoose');

const ClientSchema = new Schema({
  name: { type: String, required: true, trim: true },
  clientId: {
    type: String, required: true, trim: true, unique: true,
  },
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
            return resolve(client);
          });
      });
    }

    static findByClientId(clientId) {
      return new Promise((resolve, reject) => {
        Client.findOne({ clientId })
          .exec((err, client) => {
            if (err) return reject(err);
            return resolve(client);
          });
      });
    }

    static compareSecret(clientId, secret) {
      return new Promise(async (resolve) => {
        const client = await ClientCollection.findByClientId(clientId);
        if (!client) return resolve(false);
        return resolve(client.clientSecret === secret ? client : false);
      });
    }

    static updateClient(clientId, name, secret, redirectUrl, isTrusted) {
      return new Promise(async (resolve, reject) => {
        const client = await ClientCollection.findByClientId(clientId);
        if (!client) return reject(new Error('Client not found'));
        client.name = name;
        client.clientSecret = secret;
        client.redirectUrl = redirectUrl;
        client.isTrusted = isTrusted;
        return client.save((err) => {
          if (err) return reject(err);
          return resolve();
        });
      });
    }

    static addClient(clientId, name, secret, redirectUrl, isTrusted) {
      return new Promise(async (resolve, reject) => {
        const client = await ClientCollection.findByClientId(clientId);
        if (client) return reject(new Error('Client already exists'));
        const newClient = new Client({
          clientId, name, clientSecret: secret, redirectUrl, isTrusted,
        });
        return newClient.save((err) => {
          if (err) return reject(err);
          return resolve();
        });
      });
    }

    static deleteClient(clientId) {
      return new Promise((resolve, reject) => {
        Client.findOne({ clientId })
          .remove()
          .exec((err) => {
            if (err) return reject(err);
            return resolve();
          });
      });
    }
  }

  return ClientCollection;
}

module.exports = createSchema;
