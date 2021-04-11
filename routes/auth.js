const express = require('express');
const { check, body } = require('express-validator');

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

router.post(
  '/signup',
  isAuth.isNotLoggedIn,
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        if (value === 'test@test.com') {
          throw new Error('This email address is forbidden');
        }
        return true;
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
