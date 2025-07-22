const BookedAppointment = require("../../../models/bookedAppointment");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const { successResponse } = require("../../../utils/responseHandler");

exports.cancelAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { cancellReason } = req.body;
  console.log(id, cancellReason);
  const appointment = await BookedAppointment.findById(id);

  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  appointment.status = "Cancelled";
  appointment.cancellReason = cancellReason || "No reason provided";
  await appointment.save();

  successResponse(res, "Appointment cancelled successfully", {
    id: appointment._id,
    status: appointment.status,
    cancellReason: appointment.cancellReason,
  });
});
