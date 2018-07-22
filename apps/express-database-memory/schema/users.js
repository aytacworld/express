const users = {};

function sendUser(id) {
  return {
    username: users[id].username,
  };
}

function createSchema() {
  class UserCollection {
    static findById(id) {
      return new Promise((resolve) => {
        resolve(sendUser(id));
      });
    }

    static findByUsername(username) {
      return new Promise((resolve) => {
        resolve(sendUser(username));
      });
    }

    static comparePassword(username, password) {
      return new Promise((resolve, reject) => {
        const user = users[username];
        if (!user) return reject(new Error('User not found'));
        return resolve(user.password === password ? sendUser(username) : false);
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
        users[username] = { username, password };
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
