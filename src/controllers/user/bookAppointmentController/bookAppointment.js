const BookedAppointment = require("../../../models/bookedAppointment");
const User = require("../../../models/user");
const UserPatient = require("../../../models/userPateint");
const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");
const catchAsync = require("../../../utils/catchAsync");

exports.bookAppointment = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const {
    patientId,
    vendorId,
    category,
    appointmentDate,
    timeSlot,
    type,
    reminder,
    notes,
  } = req.body;

  if (!patientId?.trim())
    return next(new AppError("patientId is required", 400));
  if (!vendorId?.trim()) return next(new AppError("vendorId is required", 400));
  if (!appointmentDate?.trim())
    return next(new AppError("appointmentDate is required", 400));
  if (!timeSlot?.trim()) return next(new AppError("timeSlot is required", 400));

  const user = await User.findById(userId);
  if (!user) return next(new AppError("User not found", 400));

  console.log(patientId, userId);
  const patient = await UserPatient.findOne({ _id: patientId, user: userId });
  console.log("patient", patient);
  if (!patient)
    return next(
      new AppError("Patient not found or not associated with this user", 400)
    );

  const vendor = await Vendor.findById(vendorId);
  if (!vendor) return next(new AppError("Vendor not found", 400));

  const reminderTimes =
    Array.isArray(reminder) && reminder.length > 0 ? reminder : [];

  const isReminder = Array.isArray(reminder) && reminder.length > 0 ? "1" : "0"; // Convert to string for the database

  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`; // Generate a unique order ID
  const bookedAppointment = await BookedAppointment.create({
    user: userId,
    orderId,
    patient: patientId,
    vendor: vendorId,
    appointmentDate,
    timeSlot,
    type,
    category,
    reminder: reminderTimes,
    notes: notes || "",
    isReminder,
  });

  // Return success response
  successResponse(
    res,
    "Appointment booked successfully!",
    bookedAppointment,
    201
  );
});
