const mongoose = require('mongoose');
const userSchema = require('./schema/users');
const clientSchema = require('./schema/clients');
const accessTokenSchema = require('./schema/accessTokens');
const authorizationCodeSchema = require('./schema/authorizationCodes');

function connectDatabase(connectionString) {
  const conn = mongoose.createConnection(connectionString);

  return {
    users: userSchema(conn),
    clients: clientSchema(conn),
    accessTokens: accessTokenSchema(conn),
    authorizationCodes: authorizationCodeSchema(conn),
  }
}

module.exports = connectDatabase;
