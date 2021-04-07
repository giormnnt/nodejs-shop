const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/404');
const User = require('./models/user');

const app = express();

app.set('view engine', 'pug');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// * secret is used for signing the hash which secretly stores ID in the cookie.
// * resave means that the session will not be saved on every request that is done but only if there is something changed in the session.
// * saveUninitialized ensures that no session gets saved for a request where it doesnt need to be saved
app.use(
  session({ secret: 'this is secret', resave: false, saveUninitialized: false })
);

app.use((req, res, next) => {
  User.findById('606a66c4ebb3a60f9881a092')
    .then(user => {
      req.user = user; // * stores user model in request
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// * connects to mongodb cloud
mongoose
  .connect(
    'mongodb+srv://Giovanni:npsssYf5cEvNEhRb@cluster0.dxeqa.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    // * creates new user if there's NO user.
    // * returns the first user it finds
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Gio',
          email: 'gio@test.com',
          cart: {
            items: [],
          },
        });
        user.save();
      }
    });

    app.listen(3000);
  })
  .catch(err => console.log(err));
