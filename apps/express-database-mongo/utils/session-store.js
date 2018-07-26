const assert = require('assert');
const mongoSession = require('connect-mongodb-session');

class MongoStore {
  constructor(connectionString) {
    this.connectionString = connectionString;
  }

  getStore(session) {
    const MongoDBStore = mongoSession(session);

    const store = new MongoDBStore({
      uri: this.connectionUrl,
      collection: 'mysessions',
    });

    store.on('connected', () => {
      console.log('session db connected'); // eslint-disable-line
      // eslint-disable-next-line
      store.client; // The underlying MongoClient object from the MongoDB driver
    });

    // Catch errors
    store.on('error', (error) => {
      assert.ifError(error);
      assert.ok(false);
    });

    return store;
  }
}

module.exports = MongoStore;
