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
