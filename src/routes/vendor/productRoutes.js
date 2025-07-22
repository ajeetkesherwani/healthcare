const express = require("express");
const router = express.Router();

const fileUploader = require("../../middlewares/fileUploader");
const {
  vendorAuthenticate,
} = require("../../controllers/vendor/authController/vendorAuthenticate");

const {
  createProduct,
} = require("../../controllers/vendor/productController/createProduct");

const {
  updateProduct,
} = require("../../controllers/vendor/productController/updateProduct");

const {
  getProduct,
} = require("../../controllers/vendor/productController/getProduct");
const {
  productDetail,
} = require("../../controllers/vendor/productController/productDetail");

router.get("/list", vendorAuthenticate, getProduct);
router.post(
  "/create",
  vendorAuthenticate,
  fileUploader("product", [
    { name: "primary_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 5 },
  ]),
  createProduct
);
router.patch(
  "/update/:productId",
  vendorAuthenticate,
  fileUploader("product", [
    { name: "primary_image", maxCount: 1 },
    { name: "gallery_images", maxCount: 5 },
  ]),
  updateProduct
);
router.get("/details/:productId", vendorAuthenticate, productDetail);

module.exports = router;
