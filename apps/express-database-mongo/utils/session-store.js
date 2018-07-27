const mongoSession = require('connect-mongodb-session');

class MongoStore {
  constructor(connectionString, database, collection = 'mysessions') {
    this.connectionString = connectionString;
    this.database = database;
    this.collection = collection;
  }

  getStore(session) {
    const MongoDBStore = mongoSession(session);

    const store = new MongoDBStore({
      uri: this.connectionString,
      databaseName: this.database,
      collection: this.collection,
    });

    // Catch errors
    store.on('error', (error) => {
      throw new Error(error);
    });

    return store;
  }
}

module.exports = MongoStore;
