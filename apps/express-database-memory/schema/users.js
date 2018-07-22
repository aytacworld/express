const users = {};

function createSchema() {
  class UserCollection {
    static findById(id) {
      return new Promise((resolve) => {
        resolve(users[id]);
      });
    }

    static findByUsername(username) {
      return new Promise((resolve) => {
        resolve(users[username]);
      });
    }

    static comparePassword(username, password) {
      return new Promise((resolve) => {
        const user = users[username];
        if (!user) return resolve(false);
        return resolve(user.password === password ? user : false);
      });
    }

    static updateUser(username, password) {
      return new Promise((resolve, reject) => {
        const user = users[username];
        if (!user) return reject(new Error('User not found'));
        user.password = password;
        users[username] = user;
        return resolve();
      });
    }

    static addUser(username, password) {
      return new Promise((resolve, reject) => {
        const user = users[username];
        if (user) return reject(new Error('User already exists'));
        users[username] = { id: username, username, password };
        return resolve();
      });
    }

    static deleteUser(username) {
      return new Promise((resolve) => {
        delete users[username];
        resolve();
      });
    }
  }

  return UserCollection;
}

module.exports = createSchema;
