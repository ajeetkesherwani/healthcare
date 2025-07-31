const express = require("express");
const router = express.Router();
const fileUploader = require("../../middlewares/fileUploader");
const { signUp } = require("../../controllers/vendor/authController/signUp");
const { sendOtp } = require("../../controllers/vendor/authController/sendOtp");
const {
  verifyOtp,
} = require("../../controllers/vendor/authController/verifyOtp");
const {
  getProfile,
} = require("../../controllers/vendor/authController/getProfile");
const {
  updateProfile,
} = require("../../controllers/vendor/authController/updateProfile");
const {
  vendorAuthenticate,
} = require("../../controllers/vendor/auth/vendorAuthenticate");

router.post(
  "/register",
  fileUploader("vendor", [
    { name: "profileImage", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  signUp
);

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);

// Vendor profile endpoints
router.get("/profile", vendorAuthenticate, getProfile);
router.patch(
  "/profile",
  vendorAuthenticate,
  fileUploader("vendor", [{ name: "profileImg", maxCount: 1 }]),
  updateProfile
);

module.exports = router;
