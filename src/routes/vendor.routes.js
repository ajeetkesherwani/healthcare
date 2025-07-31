const express = require("express");
const router = express.Router();

router.use("/auth", require("./vendor/authRoutes"));
router.use("/product", require("./vendor/productRoutes"));
router.use("/appointment", require("./vendor/appointmentRoutes"));
router.use("/order", require("./vendor/orderRoutes"));

module.exports = router;
