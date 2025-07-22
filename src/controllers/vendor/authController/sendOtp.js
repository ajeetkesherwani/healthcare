const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.sendOtp = catchAsync(async (req, res, next) => {
  let { mobile } = req.body;
  if (!mobile) return next(new AppError("mobile field are required.", 400));

  const otp = "1234"; // You can replace with random OTP logic
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

  let vendor = await Vendor.findOne({ mobile });
  if (vendor) {
    vendor.otp = otp;
    vendor.otpExpires = otpExpires;
    await vendor.save();
  } else {
    vendor = await Vendor.create({
      mobile,
      otp,
      otpExpires,
    });
  }

  // await sendSms(vendor.mobile, `Your OTP is ${otp}`);

  successResponse(res, "OTP sent successfully", {
    otp: process.env.NODE_ENV === "development" ? otp : "1234", // Only send OTP in dev mode
  });
});
