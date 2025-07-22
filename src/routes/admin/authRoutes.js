const express = require("express");
const router = express.Router();

const { signup } = require("../../controllers/admin/auth/signup");
const { login } = require("../../controllers/admin/auth/login");
const {
  sendOtpForResetPassword,
} = require("../../controllers/admin/auth/sendOtpForResetPassword");
const {
  resetPasswordWithOtp,
} = require("../../controllers/admin/auth/resetPasswordWithOtp");
const {
  adminAuthenticate,
} = require("../../controllers/admin/auth/adminAuthenticate");

const {
  vendorAccountVerification,
} = require("../../controllers/admin/auth/vendorAccountVerification");

//Auth
router.post("/signup", signup);
router.post("/login", login);
router.post(
  "/vendorAccountVerification",
  adminAuthenticate,
  vendorAccountVerification
);
router.post("/forgotPassword", sendOtpForResetPassword);
router.post("/reset-password", resetPasswordWithOtp);
module.exports = router;
