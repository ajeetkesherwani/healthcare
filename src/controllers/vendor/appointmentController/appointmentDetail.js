const BookedAppointment = require("../../../models/bookedAppointment");
const User = require("../../../models/user");
const Patient = require("../../../models/userPateint"); // assuming your model file is named this
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const { successResponse } = require("../../../utils/responseHandler");

exports.appointmentDetail = catchAsync(async (req, res, next) => {
  const { appointmentId } = req.params;
  const vendorId = req.vendor._id;

  const appointment = await BookedAppointment.findOne({
    _id: appointmentId,
    vendor: vendorId,
  })
    .populate("user", "name email mobile")
    .populate("patient", "name age gender relation")
    .populate("category", "name");

  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  const formattedAppointment = {
    appointmentId: appointment._id,
    orderId: appointment.orderId || null,
    user: {
      id: appointment.user?._id,
      name: appointment.user?.name,
      email: appointment.user?.email,
      mobile: appointment.user?.mobile,
    },
    patient: {
      id: appointment.patient?._id,
      name: appointment.patient?.name,
      age: appointment.patient?.age,
      gender: appointment.patient?.gender,
      relation: appointment.patient?.relation,
    },
    category: {
      id: appointment.category?._id,
      name: appointment.category?.name,
    },
    appointmentDate: appointment.appointmentDate,
    timeSlot: appointment.timeSlot,
    type: appointment.type,
    status: appointment.status,
    notes: appointment.notes,
    rescheduled: appointment.rescheduled,
    rescheduleHistory: appointment.rescheduleHistory,
    rescheduleReason: appointment.rescheduleReason,
    cancellReason: appointment.cancellReason,
    isReminder: appointment.isReminder === "1",
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
  };

  successResponse(
    res,
    "Appointment details fetched successfully",
    formattedAppointment,
    200
  );
});
