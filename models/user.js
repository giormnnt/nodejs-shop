const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product', // * this stores an ObjectId and stores a reference to a product. ref takes a string. and pass the name of the model which you will relate to this.
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

// * methods key is an object that allows to add own methods.
userSchema.methods.addToCart = function (product) {
  // * getting product index
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });

  // * default value of quantity and copying cart items;
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  // * checks whether the user have already the product
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity,
    });
  }
  const updatedCart = {
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteFromCart = function (productId) {
  // * filter all items except for items that should be removed.
  const updatedCartItems = this.cart.items.filter(
    item => item.productId.toString() !== productId.toString()
  );
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');

// const { getDb } = require('../util/database');

// const { ObjectID } = mongodb;

// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id;
//   }

//   save() {
//     const db = getDb();
//     return db.collection('users').insertOne(this);
//   }

//   addToCart(product) {
//     const cartProductIndex = this.cart.items.findIndex(cp => {
//       return cp.productId.toString() === product._id.toString();
//     });
//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectID(product._id),
//         quantity: newQuantity,
//       });
//     }
//     const updatedCart = {
//       items: updatedCartItems,
//     };
//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectID(this._id) },
//         { $set: { cart: updatedCart } }
//       );
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map(i => i.productId);
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIds } })
//       .toArray()
//       .then(products =>
//         products.map(p => {
//           return {
//             ...p,
//             quantity: this.cart.items.find(
//               i => i.productId.toString() === p._id.toString()
//             ).quantity,
//           };
//         })
//       )
//       .catch(err => console.log(err));
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(
//       item => item.productId.toString() !== productId.toString()
//     );

//     const db = getDb();
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectID(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then(products => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectID(this._id),
//             name: this.name,
//           },
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };
//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new ObjectID(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch(err => console.log(err));
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectID(this._id) })
//       .toArray();
//   }
//   static findById(userId) {
//     const db = getDb();
//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectID(userId) })
//       .then(user => {
//         console.log(user);
//         return user;
//       })
//       .catch(err => console.log(err));
//   }
// }
// module.exports = User;
