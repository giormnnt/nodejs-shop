const Product = require('../models/product');
const Order = require('../models/order');

exports.getProductList = (req, res, next) => {
  // * find method does not give cursor, it gives us products.
  // * if query large amounts of date turn this into cursor. (Products.find().cursor().next() or manipulate find to limit the set of data that is retrieved)
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        products,
        pageTitle: 'All Products!',
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getProduct = (req, res, next) => {
  const { productId } = req.params;

  // * findById is also a mongoose method. it also accepts string to find id and mongoose will automatically convert to an ObjectID
  Product.findById(productId)
    .then(product => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        products,
        pageTitle: 'Welcome!',
        path: '/',
      });
    })
    .catch(err => console.log(err));
};

exports.getCart = (req, res, next) => {
  // * populate allows to tell mongoose to populate a certain field with all the detail information
  // * populate does not return promise
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart',
        products,
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const { productId } = req.body;
  Product.findById(productId)
    .then(product => {
      req.user.addToCart(product);
    })
    .then(() => res.redirect('/cart'));
};

exports.postCartDeleteProduct = (req, res, next) => {
  const { productId } = req.body;
  req.user
    .deleteFromCart(productId)
    .then(result => res.redirect('/cart'))
    .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then(orders => {
      res.render('shop/orders', {
        pageTitle: 'Your orders',
        path: '/orders',
        orders,
      });
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      // * returns user.cart.items.quantity & user.cart.items.productId
      const products = user.cart.items.map(item => {
        // * ._doc access the data that's in there
        return { quantity: item.quantity, product: { ...item.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
