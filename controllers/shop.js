const Product = require("../models/product");
const User = require("../models/user");

// const ITEMS_PER_PAGE = 12;

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    const userId = product.userId;
    User.findById(userId).then((user) => {
      res.json({
        product: product,
        user: user,
      });
    });
  });
};

exports.getIndex = (req, res, next) => {
  Product.find({ published: true }).then((products) => {
    res.json({
      prods: products,
    });
  });
};

exports.getRecent = (req, res, next) => {
  res.json({
    prods: recentProduct,
  });
};
