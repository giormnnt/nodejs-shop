const fs = require('fs');
const path = require('path');

const dir = path.dirname(process.mainModule.filename);

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    const p = path.join(dir, 'data', 'products.json');
    fs.readFile(p, (err, fileContent) => {
      let products = [];
      if (!err) {
        products = JSON.parse(fileContent);
      }
      products.push(this);
      fs.writeFile(p, JSON.stringify(products), err => {
        console.log(err);
      });
    });
  }

  static fetchAll(cb) {
    const p = path.join(dir, 'data', 'products.json');
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        cb([]);
      }
      cb(JSON.parse(fileContent));
    });
  }
};
