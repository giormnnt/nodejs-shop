const express = require('express');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/login', isAuth.isNotLoggedIn, authController.getLogin);

router.get('/signup', isAuth.isNotLoggedIn, authController.getSignup);

router.get('/reset', isAuth.isNotLoggedIn, authController.getReset);

router.get(
  '/reset/:token',
  isAuth.isNotLoggedIn,
  authController.getResetPassword
);

router.post('/login', authController.postLogin);

router.post('/signup', isAuth.isNotLoggedIn, authController.postSignup);

router.post('/logout', authController.postLogout);

router.post('/reset', isAuth.isNotLoggedIn, authController.postReset);

router.post(
  '/reset-password',
  isAuth.isNotLoggedIn,
  authController.postResetPassword
);

module.exports = router;
