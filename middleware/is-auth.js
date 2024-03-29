exports.isLoggedIn = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
};

exports.isNotLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return res.redirect('/');
  }
  next();
};
