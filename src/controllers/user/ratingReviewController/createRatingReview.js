const AppointmentRatingReview = require("../../../models/appointmentRatingReview");
const BookedAppointment = require("../../../models/bookedAppointment");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createRatingReview = catchAsync(async (req, res, next) => {
  const { appointmentId, rating, review } = req.body;
  const user_id = req.user.id;

  if (!rating || !review) {
    return next(new AppError("Rating or Review fields are required", 400));
  }

  // Check if appointment exists
  const appointment = await BookedAppointment.findById(appointmentId);
  if (!appointment) {
    return next(new AppError("Appointment not found", 404));
  }

  // Prevent duplicate review
  const existingReview = await AppointmentRatingReview.findOne({
    appointment: appointmentId,
    user: user_id,
  });

  if (existingReview) {
    return next(
      new AppError("You have already reviewed this appointment", 400)
    );
  }

  // Create and save the new review
  const newReview = await AppointmentRatingReview.create({
    appointment: appointmentId,
    user: user_id,
    vendor: appointment.vendor,
    rating,
    review,
  });

  res.status(201).json({
    success: true,
    message: "Rating Review added successfully",
    data: newReview,
  });
});
