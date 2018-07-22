const userSchema = require('./schema/users');
const clientSchema = require('./schema/clients');
const accessTokenSchema = require('./schema/accesstokens');
const authorizationCodeSchema = require('./schema/authorizationcodes');

function connectDatabase() {
  return {
    users: userSchema(),
    clients: clientSchema(),
    accessTokens: accessTokenSchema(),
    authorizationCodes: authorizationCodeSchema(),
  };
}

module.exports = connectDatabase;
