const path = require("path");

const express = require("express");
const { body } = require("express-validator/check");

const userController = require("../controllers/user");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /user/products => GET
router.get("/products", isAuth, userController.getProducts);

// /user/add-product => POST
router.post(
  "/add-product",
  [body("name").isString().isLength({ min: 3 }).trim(), body("description").isLength({ min: 5, max: 400 }).trim()],
  isAuth,
  userController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, userController.getEditProduct);

router.post(
  "/edit-product",
  [body("name").isString().isLength({ min: 3 }).trim(), body("description").isLength({ min: 5, max: 400 }).trim()],
  isAuth,
  userController.postEditProduct
);

router.delete("/product/:productId", isAuth, userController.deleteProduct);

module.exports = router;
