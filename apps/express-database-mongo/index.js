const mongoose = require('mongoose');
const userSchema = require('./schema/users');
const clientSchema = require('./schema/clients');
const accessTokenSchema = require('./schema/accesstokens');
const authorizationCodeSchema = require('./schema/authorizationcodes');
const MongoSession = require('./utils/session-store');

function connectDatabase(connectionString, applicationName) {
  const conn = mongoose.createConnection(connectionString, { useNewUrlParser: true });

  return {
    users: userSchema(conn, applicationName),
    clients: clientSchema(conn),
    accessTokens: accessTokenSchema(conn),
    authorizationCodes: authorizationCodeSchema(conn),
    sessionStore: new MongoSession(connectionString),
  };
}

module.exports = connectDatabase;
