exports.getLogin = (req, res, next) => {
  res
    .render('auth/login', {
      pageTitle: 'Login',
      path: '/login',
      orders,
    })
    .catch(err => console.log(err));
};
