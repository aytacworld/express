const bcrypt = require('bcrypt');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
  username: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  hashed: { type: Boolean, default: false },
  applications: [String],
});

UserSchema.pre('save', async function presave(next) {
  if (!this.hashed) {
    const salt = await bcrypt.genSalt(10); // TODO make saltRounds dynamic or from config.
    this.password = await bcrypt.hash(this.password, salt);
    this.hashed = true;
  }
  next();
});

function createSchema(conn, applicationName) {
  const User = conn.model('User', UserSchema);

  class UserCollection {
    static findById(id) {
      return new Promise((resolve, reject) => {
        User.findOne({ _id: id, applications: applicationName })
          .exec((err, user) => {
            if (err) return reject(err);
            return resolve(user);
          });
      });
    }

    static findByUsernameOnly(username, extraQuery = {}) {
      return new Promise((resolve, reject) => {
        User.findOne(Object.assign({ username }, extraQuery))
          .exec((err, user) => {
            if (err) return reject(err);
            return resolve(user);
          });
      });
    }

    static findByUsername(username) {
      return new Promise(async (resolve, reject) => {
        try {
          resolve(UserCollection.findByUsernameOnly(username, { applications: applicationName }));
        } catch (err) {
          reject(err);
        }
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
        user.hashed = false;
        return user.save((err) => {
          if (err) return reject(err);
          return resolve();
        });
      });
    }

    static addApplication(username, createUser = false, password = undefined) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = await UserCollection.findByUsernameOnly(username);
          if (user) {
            if (user.applications
              && user.applications.find(i => i === applicationName) !== undefined) {
              throw new Error('User already have application');
            }
            user.applications.push(applicationName);
            user.save((err) => {
              if (err) throw err;
              resolve();
            });
          } else if (createUser) {
            await this.addUser(username, password);
            resolve();
          } else {
            throw new Error('User doesn\'t exists');
          }
        } catch (e) {
          reject(e);
        }
      });
    }

    static deleteApplication(username) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = await UserCollection.findByUsername(username);
          if (!user) return resolve();
          user.applications = user.applications.filter(a => a !== applicationName);
          return user.save((err) => {
            if (err) return reject(err);
            return resolve();
          });
        } catch (e) {
          return reject(e);
        }
      });
    }

    static addUser(username, password) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = await UserCollection.findByUsernameOnly(username);
          if (user) {
            throw new Error('User already exists!');
          }
          const newUser = new User({ username, password, applications: applicationName });
          newUser.save((err) => {
            if (err) throw err;
            resolve();
          });
        } catch (err) {
          reject(err);
        }
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
