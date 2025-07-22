const BookedAppointment = require("../../../models/bookedAppointment");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const { successResponse } = require("../../../utils/responseHandler");

exports.rescheduleAppointment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { newDate, newTime, rescheduleReason } = req.body;
  console.log("Rescheduling appointment:", id, newDate, newTime);
  if (!newDate || !newTime) {
    return next(
      new AppError(
        "New appointment date, time or rescheduleReason are required",
        400
      )
    );
  }

  const appointment = await BookedAppointment.findById(id);

  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  // Add current slot to reschedule history
  appointment.rescheduleHistory.push({
    appointmentDate: appointment.appointmentDate,
    timeSlot: appointment.timeSlot,
    rescheduledAt: new Date(),
  });

  // Update appointment with new date and time
  appointment.appointmentDate = new Date(newDate); // Accepts ISO or valid date string
  appointment.timeSlot = newTime;
  appointment.rescheduled = true;
  appointment.rescheduleReason =
    rescheduleReason || "User requested reschedule";

  await appointment.save();

  successResponse(res, "Appointment rescheduled successfully", appointment);
});
