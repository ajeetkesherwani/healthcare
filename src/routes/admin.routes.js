const express = require("express");
const router = express.Router();

// Route modules
router.use("/auth", require("./admin/authRoutes"));
router.use("/category", require("./admin/categoryRoutes"));
router.use("/symptom", require("./admin/SymptomRoutes"));
router.use("/vendor", require("./admin/vendorRoutes"));

router.use("/fabric", require("./admin/fabricRoutes"));
router.use("/product", require("./admin/productRoutes"));
router.use("/varient", require("./admin/variantRoutes"));
router.use("/service", require("./admin/serviceRoutes"));
router.use("/dealsOfTheDay", require("./admin/dealsRoutes"));
router.use("/productVarient", require("./admin/productVariantRoutes"));
router.use("/newsLetter", require("./admin/newsLetterRoutes"));
router.use("/cmsPage", require("./admin/cmsPageRoutes"));
router.use("/setting", require("./admin/settingRoutes"));
router.use("/common", require("./admin/commonRoutes"));

module.exports = router;
