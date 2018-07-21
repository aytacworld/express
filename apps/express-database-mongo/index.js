const mongoose = require('mongoose');
const userSchema = require('./schema/users');
const clientSchema = require('./schema/clients');
const accessTokenSchema = require('./schema/accesstokens');
const authorizationCodeSchema = require('./schema/authorizationcodes');

function connectDatabase(connectionString) {
  const conn = mongoose.createConnection(connectionString, { useNewUrlParser: true });

  return {
    users: userSchema(conn),
    clients: clientSchema(conn),
    accessTokens: accessTokenSchema(conn),
    authorizationCodes: authorizationCodeSchema(conn),
  };
}

module.exports = connectDatabase;
