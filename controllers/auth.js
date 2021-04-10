const crypto = require('crypto');

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_user:
        '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',
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) message = message[0];
  else message = null;
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    // * retrieves the error key that was set and then removed from the session.
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) message = message[0];
  else message = null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        // * display error when there is no existing email.
        // * flash takes a key under which message will be stored.
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => res.redirect('/'));
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email })
    .then(userDoc => {
      if (userDoc) {
        req.flash('error', 'E-mail already exists');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then(password => {
          const user = new User({
            email,
            password,
            cart: { items: [] },
          });
          return user.save();
        })
        .then(() => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: 'cochehe50@gmail.com',
            subject: 'Confirm your Email',
            html: '<h1>You successfully signed up!</h1>',
          });
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) message = message[0];
  else message = null;
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Change Password',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  // * creates 32 bytes
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset');
    }
    // * generates token
    const token = buffer.toString('hex');
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('error', 'Email does not exist');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 900000;
        user.save();
      })
      .then(() => {
        res.redirect('/');
        transporter.sendMail({
          to: email,
          from: 'cochehe50@gmail.com',
          subject: 'Change Password',
          html: `
          <p>You requested a password reset</p>
          <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
          <p>This will expire in 15 minutes</p>
          `,
        });
      })
      .catch(err => console.log(err));
  });
};

exports.getResetPassword = (req, res, next) => {
  const { token } = req.params;
  // * $gt stands for greater than
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then(user => {
      if (!user) {
        req.flash('error', 'Token Expired!');
        return res.redirect('/reset');
      }
      let message = req.flash('error');
      if (message.length > 0) message = message[0];
      else message = null;
      res.render('auth/reset-password', {
        path: '/reset-passwors',
        pageTitle: 'Reset Password',
        errorMessage: message,
        userId: user._id.toString(),
      });
    })
    .catch(err => console.log(err));
};
