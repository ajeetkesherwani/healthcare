const express = require("express");
const router = express.Router();

const {
  vendorShopList,
} = require("../../controllers/user/shopController/vendorShopList");
const {
  productDetail,
} = require("../../controllers/user/shopController/productDetail");

router.get("/vendorDetail/:vendorId", vendorShopList);
router.get("/productDetail/:productId", productDetail);
module.exports = router;
