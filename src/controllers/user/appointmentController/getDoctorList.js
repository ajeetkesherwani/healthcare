const mongoose = require("mongoose");
const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");
const { successResponse } = require("../../../utils/responseHandler");
const AppError = require("../../../utils/AppError");

exports.getDoctorList = catchAsync(async (req, res, next) => {
  const { type, categoryid } = req.body;

  if (!type) {
    return next(new AppError("Type is required", 400));
  }

  const filter = {
    category: categoryid,
  };

  if (type === "inClinic") {
    filter.inClinicAvaialble = true;
  } else if (type === "videoConsultant") {
    filter.videoConsultAvailable = true;
  }

  const doctors = await Vendor.find(filter)
    .select(
      "Name yearOfExp profileImage department address inClinicFee videoConsultFee"
    )
    .populate("category", "name")
    .lean();

  return successResponse(res, "Doctors fetched successfully", doctors);
});
