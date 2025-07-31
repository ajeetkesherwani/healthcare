const express = require("express");

const router = express.Router();

router.use("/auth", require("./user/authRoutes"));
router.use("/home", require("./user/homeRoutes"));
router.use("/appointment", require("./user/appointmentRoutes"));
router.use("/userPateint", require("./user/userPateintRoutes"));
router.use("/bookAppointment", require("./user/bookAppointmentRoutes"));
router.use("/bookedAppointment", require("./user/bookedAppointmentRoutes"));
router.use("/ratingReview", require("./user/bookingRatingRoutes"));

router.use("/callRoutes", require("./user/callRoutes"));

router.use("/shop", require("./user/shopRoutes"));
router.use("/userAddress", require("./user/userAddressRoutes"));
router.use("/wishlist", require("./user/wishlistRoutes"));
router.use("/addToCart", require("./user/addToCartRoutes"));
router.use("/order", require("./user/orderRoutes"));
router.use("/cmsData", require("./user/cmsRoutes"));
module.exports = router;
