const mongodb = require('mongodb');
const { getDb } = require('../util/database');

class Product {
  constructor(title, imageUrl, price, description, id) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: new mongodb.ObjectID(this._id) }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(result => console.log(result))
      .catch(err => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then(products => {
        return products;
      })
      .catch(err => console.log(err));
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectID(id) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => console.log(err));
  }
}

module.exports = Product;
