const mongodb = require('mongodb');

const { getDb } = require('../util/database');

const { ObjectID } = mongodb;

class User {
  constructor(username, email, cart, id) {
    this.uname = username;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    return db.collection('users').insertOne(this);
  }

  addToCart(product) {
    // const cartProduct = this.cart.items.findIndex(cp => {
    //   return cp._id === product._id;
    // });

    const updatedCart = {
      items: [{ productId: new ObjectID(product._id), quantity: 1 }],
    };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectID(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new ObjectID(id) })
      .then(user => {
        console.log(user);
        return user;
      })
      .catch(err => console.log(err));
  }
}
module.exports = User;
