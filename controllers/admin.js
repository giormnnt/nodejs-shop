const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  // * gets the value of user inputted in the form
  const { title, imageUrl, price, description } = req.body;
  // * pass one argument only and it is a js object where we map different values that were defined in schema. (ORDER does NOT matter)
  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    userId: req.user, // * same with storing using req.user._id
  });
  product
    .save() // * save method comes from mongoose it saves data. if we call save to an existing object, it will not be saved as new one but the changes will be saved.
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch(err => console.log(err));
};

exports.getProductList = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/product-list', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/product-list',
      });
    })
    .catch(err => console.log(err));
};

exports.getEditProduct = (req, res, next) => {
  const { edit } = req.query;
  if (!edit) {
    return res.redirect('/');
  }
  const { productId } = req.params;
  Product.findById(productId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: edit,
        product,
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  Product.findById(productId)
    .then(product => {
      console.log('PRODUCT');
      console.log(product);
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save(); // * updates the product
    })
    .then(() => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/product-list');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  // * deletes product
  const { productId } = req.body;
  Product.findByIdAndDelete(productId)
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch();
};
