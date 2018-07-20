const { Schema } = require('mongoose');

const UserSchema = new Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
});

// TODO use hashing for password, and save salt for hashing
// TODO send user without password(and salt), so do the password comparing here

function createSchema(conn) {
  const User = conn.model('User', UserSchema);

  class UserCollection {
    static async findById(id) {
      return new Promise((resolve, reject) => {
        User.findById(id)
          .exec((err, user) => {
            if (err) return reject(err);
            return resolve(user);
          });
      });
    }

    static async findByUsername(username) {
      return new Promise((resolve, reject) => {
        User.findOne({ username })
          .exec((err, user) => {
            if (err) return reject(err);
            return resolve(user);
          });
      });
    }
  }

  return UserCollection;
}

module.exports = createSchema;
