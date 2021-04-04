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
  // * pass one argument only and it is a javascript object where we map different values that were defined in schema. (ORDER does NOT matter)
  const product = new Product({ title, imageUrl, price, description });
  product
    .save() // * save method comes from mongoose it saves data.
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch(err => console.log(err));
};

exports.getProductList = (req, res, next) => {
  Product.fetchAll()
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
  const product = new Product(title, imageUrl, price, description, productId);
  product
    .save()
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/product-list');
    })
    .catch(err => console.log(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/product-list');
    })
    .catch();
};
