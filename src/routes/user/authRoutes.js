const express = require("express");
const router = express.Router();

const sendOtp = require("../../controllers/user/authController/sendOtp");
const {
  verifyOtp,
} = require("../../controllers/user/authController/verifyOtp");
const {
  userAuthenticate,
} = require("../../controllers/user/authController/userAuthenticate");
const {
  getProfile,
} = require("../../controllers/user/authController/getProfile");
const {
  updateProfile,
} = require("../../controllers/user/authController/updateProfile");
const fileUploader = require("../../middlewares/fileUploader");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Get user profile
router.get("/profile", userAuthenticate, getProfile);

// Update user profile
router.patch(
  "/profile",
  userAuthenticate,
  fileUploader("user", [{ name: "profileImage", maxCount: 1 }]),
  updateProfile
);

module.exports = router;
