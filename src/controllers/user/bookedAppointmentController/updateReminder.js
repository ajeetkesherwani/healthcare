const BookedAppointment = require("../../../models/bookedAppointment");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.updateReminder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  let reminder = "0";
  const bookedAppointment = await BookedAppointment.findById(id);
  if (!bookedAppointment) {
    return next(new AppError("Appointment not found", 404));
  }

  if (bookedAppointment.isReminder == "0") {
    reminder = "1"; // Set reminder to "1" if it was previously "0"
  }

  const updateReminder = await BookedAppointment.findByIdAndUpdate(
    id,
    { isReminder: reminder } // Set isReminder to "1" to indicate reminder is set
  );
  if (!updateReminder) {
    return next(new AppError("Appointment not found", 200));
  }
  successResponse(res, "Reminder updated successfully", updateReminder);
});
