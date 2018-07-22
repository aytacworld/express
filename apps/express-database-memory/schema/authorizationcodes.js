const codes = {};

function createSchema() {
  class AuthorizationCodeCollection {
    static find(key) {
      return new Promise((resolve, reject) => {
        const code = codes[key];
        return code ? resolve(code) : reject(new Error('Code Not Found'));
      });
    }

    static save(code, clientId, redirectUri, userId) {
      return new Promise((resolve) => {
        codes[code] = {
          code, clientId, redirectUri, userId,
        };
        resolve();
      });
    }
  }

  return AuthorizationCodeCollection;
}

module.exports = createSchema;
