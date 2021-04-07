exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // * Setting cookies
  // * Expires has its own data format.
  // * Max-Age is set on seconds.
  // * Secure can only be accessed the website is on https.
  // * HttpOnly can't access the cookie value through client side js.
  res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
  res.redirect('/');
};
