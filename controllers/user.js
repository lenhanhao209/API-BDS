const mongoose = require("mongoose");

const fileHelper = require("../util/file");

const { validationResult } = require("express-validator/check");

const Product = require("../models/product");

exports.postAddProduct = (req, res, next) => {
  const name = req.body.name;
  const acreage = req.body.acreage;
  const address = req.body.address;
  const images = req.files;
  const price = req.body.price;
  const description = req.body.description;
  if (!images) {
    return res.status(422).json({
      editing: false,
      hasError: true,
      product: {
        price: price,
        name: name,
        acreage: acreage,
        address: address,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      editing: false,
      hasError: true,
      product: {
        price: price,
        name: name,
        acreage: acreage,
        address: address,
        description: description,
      },
      errorMessage: errors.array()[0].msg,
    });
  }
  const imageUrl = images.map((image) => image.path);
  const product = new Product({
    price: price,
    name: name,
    acreage: acreage,
    address: address,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
    published: false,
    role: "user",
  });
  product.save();
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.json({ message: messgage });
  }
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) {
      return res.json({ message: messgage });
    }
    res.json({
      editing: editMode,
      product: product,
      hasError: false,
      errorMessage: null,
      validationErrors: [],
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedName = req.body.name;
  const updatedPrice = req.body.price;
  const updatedAcreage = req.body.acreage;
  const updatedAddress = req.body.address;
  const updatedDesc = req.body.description;
  const image = req.files;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      editing: true,
      hasError: true,
      product: {
        name: updatedName,
        price: updatedPrice,
        acreage: updatedAcreage,
        address: updatedAddress,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  Product.findById(prodId).then((product) => {
    if (product.userId.toString() !== req.user._id.toString()) {
      return res.json({ message: messgage });
    }
    product.name = updatedName;
    product.price = updatedPrice;
    product.acreage = updatedAcreage;
    product.address = updatedAddress;
    product.price = updatedPrice;
    product.description = updatedDesc;
    if (image) {
      for (let i = 0; i < product.imageUrl.length; i++) {
        fileHelper.deleteFile(product.imageUrl[i]);
      }
      const images = req.files;
      const imageUrl = images.map((image) => image.path);
      product.imageUrl = imageUrl;
    }
    return product.save();
  });
};

exports.getProducts = (req, res, next) => {
  Product.find({ userId: req.user._id }).then((products) => {
    res.json({
      prods: products,
    });
  });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId).then((product) => {
    if (!product) {
      return next(new Error("Product not found."));
    }
    fileHelper.deleteFile(product.imageUrl[0]);
    return Product.deleteOne({ _id: prodId, userId: req.user._id });
  });
};
