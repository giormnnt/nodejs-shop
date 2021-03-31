const { MongoClient } = require('mongodb');

const mongoConnect = callback => {
  MongoClient.connect(
    'mongodb+srv://Giovanni:npsssYf5cEvNEhRb@cluster0.dxeqa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
  )
    .then(result => {
      console.log('Connected!');
      callback(result);
    })
    .catch(err => console.log(err));
};

module.exports = mongoConnect;
