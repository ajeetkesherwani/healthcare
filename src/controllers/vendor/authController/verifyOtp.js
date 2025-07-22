const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const createToken = require("../../../utils/createToken");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");
const bcrypt = require("bcrypt");

exports.verifyOtp = catchAsync(async (req, res, next) => {
  let { mobile, otp } = req.body;
  if (!mobile || !otp)
    return next(new AppError("mobile or otp field are required.", 404));

  const vendor = await Vendor.findOne({ mobile });

  if (!vendor)
    return next(new AppError("Doctor not found with this mobile number.", 404));

  if (!vendor.status)
    return next(
      new AppError("You are not verified. Wait for verification", 404)
    );

  if (vendor.isBlocked) return next(new AppError("You are blocked", 404));

  if (
    !vendor.otp ||
    vendor.otp !== otp ||
    !vendor.otpExpires ||
    new Date() > new Date(vendor.otp.otpExpires)
  ) {
    return next(new AppError("Invalid or expired OTP.", 401));
  }

  // Optionally, clear OTP after successful verification
  vendor.otp = undefined;
  await vendor.save();

  createToken(vendor, 200, res);
});
