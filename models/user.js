const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
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
