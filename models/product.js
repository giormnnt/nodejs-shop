const mongoose = require('mongoose');

// * allows to create new schemas
const { Schema } = mongoose;

// * creates product schema.
// * pass a js object and defines how your product looks like. pass a key and it needs a type.

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// * mongoose.model connects a schema, blueprint with a name.
// * mongoose takes model name as your collection name and it turns it all to lowercase and plural form.
module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');

// const { getDb } = require('../util/database');

// class Product {
//   constructor(title, imageUrl, price, description, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.price = price;
//     this.description = description;
//     this._id = id ? new mongodb.ObjectID(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOp;
//     if (this._id) {
//       dbOp = db
//         .collection('products')
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//       .then(result => console.log(result))
//       .catch(err => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find()
//       .toArray()
//       .then(products => {
//         return products;
//       })
//       .catch(err => console.log(err));
//   }

//   static findById(id) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .find({ _id: new mongodb.ObjectID(id) })
//       .next()
//       .then(product => {
//         return product;
//       })
//       .catch(err => console.log(err));
//   }

//   static deleteById(id) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .deleteOne({ _id: new mongodb.ObjectID(id) })
//       .then(result => {
//         console.log('Deleted');
//       })
//       .catch(err => console.log(err));
//   }
// }

// module.exports = Product;
