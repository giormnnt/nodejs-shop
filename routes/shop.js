const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProductList);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth.isLoggedIn, shopController.getCart);

router.post('/cart', isAuth.isLoggedIn, shopController.postCart);

router.post(
  '/cart-delete-item',
  isAuth.isLoggedIn,
  shopController.postCartDeleteProduct
);

router.get('/checkout', isAuth.isLoggedIn, shopController.getCheckout);

router.get(
  '/checkout/success',
  isAuth.isLoggedIn,
  shopController.getCheckoutSuccess
);

router.get('/checkout/cancel', isAuth.isLoggedIn, shopController.getCheckout);

router.get('/orders', isAuth.isLoggedIn, shopController.getOrders);

router.get('/orders/:orderId', isAuth.isLoggedIn, shopController.getInvoice);

module.exports = router;
