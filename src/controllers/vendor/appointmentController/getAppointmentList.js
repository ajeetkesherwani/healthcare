const BookedAppointment = require("../../../models/bookedAppointment");
const User = require("../../../models/user");
const Patient = require("../../../models/userPateint"); // assuming your model file is named this
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const { successResponse } = require("../../../utils/responseHandler");

exports.getAppointmentList = catchAsync(async (req, res, next) => {
  const vendorId = req.vendor._id;

  const allAppointments = await BookedAppointment.find({ vendor: vendorId })
    .populate("user", "name email mobile")
    .populate("patient", "name age gender relation")
    .populate("category", "name")
    .sort({ createdAt: -1 });

  if (!allAppointments || allAppointments.length === 0) {
    return next(new AppError("No appointments found", 404));
  }

  const formattedAppointments = allAppointments.map((appt) => ({
    appointmentId: appt._id,
    userName: appt.user?.name || null,
    patientName: appt.patient?.name || null,
    patientAge: appt.patient?.age || null,
    patientGender: appt.patient?.gender || null,
    categoryName: appt.category?.name || null,
    orderId: appt.orderId || null,
    appointmentDate: appt.appointmentDate,
    timeSlot: appt.timeSlot,
    status: appt.status,
    type: appt.type,
    isReminder: appt.isReminder === "1",
    notes: appt.notes || "",
    rescheduled: appt.rescheduled,
    rescheduleHistory: appt.rescheduleHistory || [],
    rescheduleReason: appt.rescheduleReason || "",
    cancellReason: appt.cancellReason || "",
    createdAt: appt.createdAt,
  }));

  data = {
    appointments: formattedAppointments,
    count: formattedAppointments.length,
  };

  successResponse(res, "All appointments found for the vendor", data, 200);
});
