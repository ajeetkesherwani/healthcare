const express = require("express");
const router = express.Router();

const fileUploader = require("../../middlewares/fileUploader");
const {
  vendorAuthenticate,
} = require("../../controllers/vendor/authController/vendorAuthenticate");

const {
  getOrderList,
} = require("../../controllers/vendor/orderController/getOrderList");
const {
  orderDetail,
} = require("../../controllers/vendor/orderController/orderDetail");

router.get("/list", vendorAuthenticate, getOrderList);
router.get("/details/:productId", vendorAuthenticate, orderDetail);

module.exports = router;
