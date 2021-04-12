const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');

const router = express.Router();

router.get('/login', isAuth.isNotLoggedIn, authController.getLogin);

router.get('/signup', isAuth.isNotLoggedIn, authController.getSignup);

router.get('/reset', isAuth.isNotLoggedIn, authController.getReset);

router.get(
  '/reset/:token',
  isAuth.isNotLoggedIn,
  authController.getResetPassword
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
    body('password', 'Password has to be valid.')
      .isLength({ min: 3 })
      .isAlphanumeric(),
  ],
  authController.postLogin
);

router.post(
  '/signup',
  isAuth.isNotLoggedIn,
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        // if (value === 'test@test.com')
        //   throw new Error('This emaill address is forbidden');
        // return true;
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('Email exists already');
          }
        });
      }),
    body(
      'password',
      'Please enter a password with only text, numbers and at least 8 characters'
    )
      .isLength({ min: 8 })
      .isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password does not match');
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post('/logout', authController.postLogout);

router.post('/reset', isAuth.isNotLoggedIn, authController.postReset);

router.post(
  '/reset-password',
  isAuth.isNotLoggedIn,
  authController.postResetPassword
);

module.exports = router;
