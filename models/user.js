const mongodb = require('mongodb');

const { getDb } = require('../util/database');

const { ObjectID } = mongodb;

class User {
  constructor(username, email) {
    this.uname = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  static findById(id) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new ObjectID(id) });
  }
}
module.exports = User;
