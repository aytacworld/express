const records = {
  jack: {
    hello: 'world',
    foo: 'bar',
  },
};

class ProfileCollection {
  static findByUsername(username) {
    return new Promise((resolve) => {
      resolve(records[username]);
    });
  }
}

module.exports = { profiles: ProfileCollection };
