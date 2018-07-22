const tokens = {};

function createSchema() {
  class AccessTokenCollection {
    static find(key) {
      return new Promise((resolve, reject) => {
        const token = tokens[key];
        return token ? resolve(token) : reject(new Error('Token Not Found'));
      });
    }

    static findByUserIdAndClientId(userId, clientId) {
      return new Promise((resolve, reject) => {
        const tokenKeys = Object.keys(tokens);
        for (let i = 0; i < tokenKeys; i += 1) {
          const token = tokens[tokenKeys[i]];
          if (token.userId === userId && token.clientId === clientId) return resolve(token);
        }
        return reject(new Error('Token Not Found'));
      });
    }

    static save(token, userId, clientId) {
      return new Promise((resolve) => {
        tokens[token] = { token, userId, clientId };
        resolve();
      });
    }
  }

  return AccessTokenCollection;
}

module.exports = createSchema;
