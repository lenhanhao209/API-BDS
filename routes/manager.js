const express = require("express");
const { body } = require("express-validator/check");

const managerController = require("../controllers/manager");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /user/products => GET
router.get("/approve", isAuth, managerController.getApproveProducts);
router.get("/approve/:productId", managerController.getProduct);
router.post("/approve/", managerController.postConfirm);

module.exports = router;
