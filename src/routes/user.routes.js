const express = require("express");

const router = express.Router();

// const { getProfile } = require("../controllers/user/authController/getProfile");
// const updateProfile = require("../controllers/user/authController/updateProfile");
// const fileUploader = require("../middlewares/fileUploader");
// const {
//   userAuthenticate,
// } = require("../controllers/user/authController/userAuthenticate");

// const {
//   getAllServices,
// } = require("../controllers/user/homeController/getAllServices");

// const {
//   getHomeData,
// } = require("../controllers/user/homeController/getHomeData");
// const {
//   getServiceCategory,
// } = require("../controllers/user/homeController/getServiceCategory");
// router.get("/test", (req, res) => {
//   res.status(200).json({ message: "this is user test route" });
// });

// //=================== UnAuthenticated End Points ===================================//
// // router.get("/home/:type", getHomeData);
// router.get("/get-allServices", getAllServices);
// router.get("/serviceCategory/list/:serviceId", getServiceCategory);

// //=================== Authenticated End Points ===================================//

// //=================== Profile End Points ===================================//
// router.get("/profile", userAuthenticate, getProfile);
// router.patch(
//   "/profile",
//   userAuthenticate,
//   fileUploader("user", [{ name: "profileImage", maxCount: 1 }]),
//   updateProfile
// );

router.use("/auth", require("./user/authRoutes"));
router.use("/home", require("./user/homeRoutes"));
router.use("/appointment", require("./user/appointmentRoutes"));
router.use("/userPateint", require("./user/userPateintRoutes"));
router.use("/bookAppointment", require("./user/bookAppointmentRoutes"));
router.use("/bookedAppointment", require("./user/bookedAppointmentRoutes"));
router.use("/ratingReview", require("./user/bookingRatingRoutes"));

router.use("/shop", require("./user/shopRoutes"));
router.use("/userAddress", require("./user/userAddressRoutes"));
router.use("/wishlist", require("./user/wishlistRoutes"));
router.use("/addToCart", require("./user/addToCartRoutes"));
router.use("/order", require("./user/orderRoutes"));
router.use("/cmsData", require("./user/cmsRoutes"));
module.exports = router;
