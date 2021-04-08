const { ObjectId } = require('bson');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  user: {
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  products: [
    {
      product: { type: Object, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model('Order', orderSchema);
