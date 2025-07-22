const BookedAppointment = require("../../../models/bookedAppointment");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const { successResponse } = require("../../../utils/responseHandler");

exports.bookedAppointmentDetail = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(new AppError("Appointment ID is required", 400));
  }
  const bookedAppointment = await BookedAppointment.findById(id)
    .populate([
      { path: "user", select: "name email" },
      { path: "patient", select: "name" },
      { path: "vendor", select: "Name department mobile" },
      { path: "category", select: "name description" },
    ])
    .lean();

  if (!bookedAppointment) {
    return next(new AppError("Appointment not found", 200));
  }
  successResponse(
    res,
    "Booked appointment details fetched successfully",
    bookedAppointment
  );
});
