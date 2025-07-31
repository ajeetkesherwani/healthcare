const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const createToken = require("../../../utils/createToken");

exports.verifyOtp = catchAsync(async (req, res, next) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return next(new AppError("Mobile and OTP fields are required.", 400));
  }

  const vendor = await Vendor.findOne({ mobile });

  if (!vendor) {
    return next(new AppError("User not found with this mobile number.", 404));
  }

  // Check OTP validity
  if (
    !vendor.otp ||
    vendor.otp !== otp ||
    !vendor.otpExpires ||
    new Date() > new Date(vendor.otpExpires)
  ) {
    return next(new AppError("Invalid or expired OTP.", 401));
  }

  // OTP is valid → clear OTP
  vendor.otp = undefined;
  vendor.otpExpires = undefined;
  await vendor.save();

  // Check registration status
  const isRegistered = vendor.status === true && vendor.isBlocked === false;

  if (!isRegistered) {
    return res.status(200).json({
      success: true,
      message:
        "OTP verified, but User is not registered (not verified or blocked).",
      isRegistered: false,
    });
  }

  createToken(vendor, 200, res, {
    message: "OTP verified and user is registered.",
    isRegistered: true,
  });
});
