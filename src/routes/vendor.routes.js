const express = require("express");

// const {
//   createProduct,
//   getAllProducts,
//   getProductById,
//   updateProduct,
//   updateStockStatus,
//   deleteProduct,
// } = require("../controllers/vendor/product");
// const fileUploader = require("../middlewares/fileUploader");

const router = express.Router();

//------------------------------------------------
// product managment
//------------------------------------------------
// router.post(
//   "/product",
//   fileUploader("product", [
//     { name: "primary_image", maxCount: 1 },
//     { name: "gallery_image", maxCount: 10 },
//   ]),
//   createProduct
// );
// router.get("/product", getAllProducts);
// router.get("/product/:id", getProductById);
// router.patch(
//   "/product/:id",
//   fileUploader("product", [
//     { name: "primary_image", maxCount: 1 },
//     { name: "gallery_image", maxCount: 10 },
//   ]),
//   updateProduct
// );
// router.patch("/product/:id/stock-status", updateStockStatus);
// router.delete("/product/:id", deleteProduct);

router.use("/auth", require("./vendor/authRoutes"));
router.use("/product", require("./vendor/productRoutes"));
router.use("/order", require("./vendor/orderRoutes"));

module.exports = router;
