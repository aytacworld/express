const clients = {};

function createSchema() {
  class ClientCollection {
    static findById(id) {
      return new Promise((resolve) => {
        resolve(clients[id]);
      });
    }

    static findByClientId(clientId) {
      return new Promise((resolve) => {
        resolve(clients[clientId]);
      });
    }

    static compareSecret(clientId, secret) {
      return new Promise((resolve) => {
        const client = clients[clientId];
        if (!client) return resolve(false);
        return resolve(client.clientSecret === secret ? client : false);
      });
    }

    static updateClient(clientId, name, secret, redirectUrl, isTrusted) {
      return new Promise((resolve, reject) => {
        const client = clients[clientId];
        if (!client) return reject(new Error('Client not found'));
        client.name = name;
        client.clientSecret = secret;
        client.redirectUrl = redirectUrl;
        client.isTrusted = isTrusted;
        clients[clientId] = client;
        return resolve();
      });
    }

    static addClient(clientId, name, secret, redirectUrl, isTrusted) {
      return new Promise((resolve, reject) => {
        const client = clients[clientId];
        if (client) return reject(new Error('Client already exists'));
        clients[clientId] = {
          clientId, name, secret, redirectUrl, isTrusted,
        };
        return resolve();
      });
    }

    static deleteClient(clientId) {
      return new Promise((resolve) => {
        delete clients[clientId];
        resolve();
      });
    }
  }

  return ClientCollection;
}

module.exports = createSchema;
