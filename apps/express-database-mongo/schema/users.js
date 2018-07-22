const bcrypt = require('bcrypt');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function presave(next) {
  const salt = await bcrypt.genSalt(10); // TODO make saltRounds dynamic or from config.
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

function createSchema(conn) {
  const User = conn.model('User', UserSchema);

  class UserCollection {
    static findById(id) {
      return new Promise((resolve, reject) => {
        User.findById(id)
          .exec((err, user) => {
            if (err) return reject(err);
            return resolve(user);
          });
      });
    }

    static findByUsername(username) {
      return new Promise((resolve, reject) => {
        User.findOne({ username })
          .exec((err, user) => {
            if (err) return reject(err);
            return resolve(user);
          });
      });
    }

    static comparePassword(username, password) {
      return new Promise(async (resolve) => {
        const user = await UserCollection.findByUsername(username);
        if (!user) return resolve(false);
        const match = await bcrypt.compare(password, user.password);
        return resolve(match ? user : false);
      });
    }

    static updateUser(username, password) {
      return new Promise(async (resolve, reject) => {
        const user = await UserCollection.findByUsername(username);
        if (!user) return reject(new Error('User not found'));
        user.password = password;
        return user.save((err) => {
          if (err) return reject(err);
          return resolve();
        });
      });
    }

    static addUser(username, password) {
      return new Promise(async (resolve, reject) => {
        const user = await UserCollection.findByUsername(username);
        if (user) return reject(new Error('User already exists'));
        const newUser = new User({ username, password });
        return newUser.save((err) => {
          if (err) return reject(err);
          return resolve();
        });
      });
    }

    static deleteUser(username) {
      return new Promise((resolve, reject) => {
        User.findOne({ username })
          .remove()
          .exec((err) => {
            if (err) return reject(err);
            return resolve();
          });
      });
    }
  }

  return UserCollection;
}

module.exports = createSchema;
