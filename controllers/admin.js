const { validationResult } = require('express-validator');

const Product = require('../models/product');

const error500 = (err, next) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  return next(error);
};

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  // * gets the value of user inputted in the form
  const { title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }
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
    .catch(err => {
      error500(err, next);
    });
};

exports.getProductList = (req, res, next) => {
  Product.find({ userId: req.user._id })
    .then(products => {
      res.render('admin/product-list', {
        products,
        pageTitle: 'Admin Products',
        path: '/admin/product-list',
      });
    })
    .catch(err => {
      error500(err, next);
    });
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
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch(err => {
      error500(err, next);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, imageUrl, price, description } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
        _id: productId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      product.title = title;
      product.imageUrl = imageUrl;
      product.price = price;
      product.description = description;
      return product.save().then(() => {
        res.redirect('/admin/product-list');
      }); // * updates the product
    })

    .catch(err => {
      error500(err, next);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  // * deletes product
  const { productId } = req.body;
  Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
      res.redirect('/admin/product-list');
    })
    .catch(err => {
      error500(err, next);
    });
};
