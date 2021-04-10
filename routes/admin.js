const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/add-product', isAuth.isLoggedIn, adminController.getAddProduct);

router.get('/product-list', isAuth.isLoggedIn, adminController.getProductList);

router.post('/add-product', isAuth.isLoggedIn, adminController.postAddProduct);

router.get(
  '/edit-product/:productId',
  isAuth.isLoggedIn,
  adminController.getEditProduct
);

router.post(
  '/edit-product',
  isAuth.isLoggedIn,
  adminController.postEditProduct
);

router.post(
  '/delete-product',
  isAuth.isLoggedIn,
  adminController.postDeleteProduct
);

module.exports = router;
