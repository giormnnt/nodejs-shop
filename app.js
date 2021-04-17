const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  'mongodb+srv://Giovanni:npsssYf5cEvNEhRb@cluster0.dxeqa.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});
const csrfProtection = csrf();

// * diskStorage is a storage engine which you can use with multer.
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // * first argument is an error message to inform multer that something is wrong with the incoming file and should not store it. if it's null then it's OK to store it.
    // * second argument is where to store it.
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    // * second argument is the file name that will use
    // * this will not overwrite each other if there's two images with the same name.
    const uniquePrefix = `${Date.now()}-${Math.random(Math.random() * 1e9)}`;
    cb(null, `${uniquePrefix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'pug');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
// * secret is used for signing the hash which secretly stores ID in the cookie.
// * resave means that the session will not be saved on every request that is done but only if there is something changed in the session.
// * saveUninitialized ensures that no session gets saved for a request where it doesnt need to be saved
app.use(
  session({
    secret: 'this is secret',
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user; // * stores user model in request
      next();
    })
    .catch(err => {
      // * need to call next if throwing an error in async
      next(new Error(err));
    });
});

app.use((req, res, next) => {
  // * this allows us to set local variables that are passed into the views
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn,
  });
});

// * connects to mongodb cloud
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(3000);
  })
  .catch(err => console.log(err));
