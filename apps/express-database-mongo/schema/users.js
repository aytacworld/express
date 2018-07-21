const bcrypt = require('bcrypt');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function presave(next) {
  // save the hashed version of the password
  const salt = await bcrypt.genSalt(10); // TODO make saltRounds dynamic or from config.
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

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

    static async comparePassword(username, password) {
      return new Promise(async (resolve, reject) => {
        const user = await UserCollection.findByUsername(username);
        if (!user) return reject(new Error('User not found'));
        const match = await bcrypt.compare(password, user.password);
        return resolve(match);
      });
    }

    // static async addUser(username, password) {
    //   throw new Error('Not implemented yet');
    // }
  }

  return UserCollection;
}

module.exports = createSchema;
