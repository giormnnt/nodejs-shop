const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/404');
const mongoConnect = require('./util/database');

const app = express();

app.set('view engine', 'pug');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {});

// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

mongoConnect(client => {
  console.log(client);
  app.listen(3000);
});
