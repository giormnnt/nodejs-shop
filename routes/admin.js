const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

const { body } = require('express-validator');

router.get('/add-product', isAuth.isLoggedIn, adminController.getAddProduct);

router.get('/product-list', isAuth.isLoggedIn, adminController.getProductList);

router.post(
  '/add-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .withMessage('Title should have minimum of 3 characters')
      .trim(),
    body('image'),
    body('price').isFloat().withMessage('Price needs at least two decimals'),
    body('description')
      .isLength({ min: 3, max: 400 })
      .withMessage(
        'Description should have minumum of 3 characters and maximum of 400 characters only'
      )
      .trim(),
  ],
  isAuth.isLoggedIn,
  adminController.postAddProduct
);

router.get(
  '/edit-product/:productId',
  isAuth.isLoggedIn,
  adminController.getEditProduct
);

router.post(
  '/edit-product',
  [
    body('title')
      .isString()
      .isLength({ min: 3 })
      .withMessage('Title should have minimum of 3 characters')
      .trim(),
    body('price').isFloat().withMessage('Price needs at least two decimals'),
    body('description')
      .isLength({ min: 5, max: 400 })
      .withMessage(
        'Description should have minumum of 3 characters and maximum of 400 characters only'
      )
      .trim(),
  ],
  isAuth.isLoggedIn,
  adminController.postEditProduct
);

router.post(
  '/delete-product',
  isAuth.isLoggedIn,
  adminController.postDeleteProduct
);

module.exports = router;
