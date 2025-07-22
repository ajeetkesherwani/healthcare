const Vendor = require("../../../models/vendor");
const BookedAppointment = require("../../../models/bookedAppointment");
const moment = require("moment-timezone");
const catchAsync = require("../../../utils/catchAsync");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

// Helper to generate slots
function generateTimeSlots({
  openingTime,
  closingTime,
  sessionTime,
  breakTime,
  lunchStart,
  lunchEnd,
  selectDays,
  date,
  bookedSlots,
}) {
  const slots = [];
  const dayOfWeek = moment(date).format("dddd");

  // Skip if not a selected day
  if (!selectDays.includes(dayOfWeek)) return slots;

  let currentTime = moment.tz(
    `${date} ${openingTime}`,
    "YYYY-MM-DD hh:mm A",
    "Asia/Kolkata"
  );
  const endTime = moment.tz(
    `${date} ${closingTime}`,
    "YYYY-MM-DD hh:mm A",
    "Asia/Kolkata"
  );

  const lunchStartTime = lunchStart
    ? moment.tz(`${date} ${lunchStart}`, "YYYY-MM-DD hh:mm A", "Asia/Kolkata")
    : null;
  const lunchEndTime = lunchEnd
    ? moment.tz(`${date} ${lunchEnd}`, "YYYY-MM-DD hh:mm A", "Asia/Kolkata")
    : null;

  const now = moment.tz("Asia/Kolkata");
  const isToday = moment(date).isSame(now, "day");

  let iterationCount = 0;
  const maxIterations = 500; // Safety to prevent infinite loops

  while (currentTime.isBefore(endTime) && iterationCount++ < maxIterations) {
    const nextTime = moment(currentTime).add(sessionTime, "minutes");

    // Skip past time if it's today
    if (isToday && currentTime.isBefore(now)) {
      currentTime = nextTime.add(breakTime, "minutes");
      continue;
    }

    // Skip lunch break
    if (
      lunchStartTime &&
      lunchEndTime &&
      currentTime.isSameOrAfter(lunchStartTime) &&
      currentTime.isBefore(lunchEndTime)
    ) {
      console.log(
        `Skipping lunch break from ${lunchStartTime.format(
          "HH:mm"
        )} to ${lunchEndTime.format("HH:mm")}`
      );
      currentTime = moment(lunchEndTime); // Advance past lunch
      continue;
    }

    const start = currentTime.format("HH:mm");
    const end = nextTime.format("HH:mm");

    const isBooked = bookedSlots.includes(start); // Use start time for booking match

    slots.push({
      start,
      end,
      status: isBooked ? "booked" : "available",
    });

    // Move to next slot
    currentTime = nextTime.add(breakTime, "minutes");
  }

  if (iterationCount >= maxIterations) {
    console.warn(
      "Slot generation terminated early due to too many iterations."
    );
  }

  return slots;
}

exports.getAvailableSlots = catchAsync(async (req, res) => {
  const { vendorId, date } = req.query;

  if (!vendorId || !date) {
    errorResponse(res, "vendorId and date are required (YYYY-MM-DD)", 400);
  }
  const vendor = await Vendor.findById(vendorId);

  if (!vendor) {
    errorResponse(res, "Vendor not found", 404);
  }
  // Get already booked slots for this vendor and date
  const appointments = await BookedAppointment.find({
    vendor: vendorId,
    appointmentDate: {
      $gte: new Date(date + "T00:00:00.000Z"),
      $lte: new Date(date + "T23:59:59.999Z"),
    },
  });
  const bookedSlots = appointments.map((a) => a.timeSlot);
  const slots = generateTimeSlots({
    openingTime: vendor.openingTime,
    closingTime: vendor.closingTime,
    sessionTime: vendor.sessionTime,
    breakTime: vendor.breakTime,
    lunchStart: vendor.lunchStart,
    lunchEnd: vendor.lunchEnd,
    selectDays: vendor.selectDays,
    date,
    bookedSlots,
  });
  successResponse(res, "Slotes Generated Successfully", slots);
});

exports.getReminderSlots = catchAsync(async (req, res) => {
  const { vendorId, date, selectedSlotStart } = req.query;

  if (!vendorId || !date) {
    return res.status(400).json({
      success: false,
      message: "vendorId and date are required (YYYY-MM-DD)",
    });
  }
  const vendor = await Vendor.findById(vendorId);
  if (!vendor) {
    return res
      .status(404)
      .json({ success: false, message: "Vendor not found" });
  }
  // Get already booked slots for this vendor and date
  const appointments = await BookedAppointment.find({
    vendor: vendorId,
    appointmentDate: {
      $gte: new Date(date + "T00:00:00.000Z"),
      $lte: new Date(date + "T23:59:59.999Z"),
    },
  });
  const bookedSlots = appointments.map((a) => a.timeSlot);
  const slots = generateTimeSlots({
    openingTime: vendor.openingTime,
    closingTime: vendor.closingTime,
    sessionTime: vendor.sessionTime,
    breakTime: vendor.breakTime,
    lunchStart: vendor.lunchStart,
    lunchEnd: vendor.lunchEnd,
    selectDays: vendor.selectDays,
    date,
    bookedSlots,
  });
  // Only available slots
  const availableSlots = slots.filter((slot) => slot.status === "available");

  let reminderSlots;
  if (selectedSlotStart) {
    // All available slots before the selected slot
    reminderSlots = availableSlots.filter(
      (slot) => slot.start < selectedSlotStart
    );
  } else {
    // All available slots from now
    const now = moment.tz("Asia/Kolkata").format("HH:mm");
    reminderSlots = availableSlots.filter((slot) => slot.start >= now);
  }

  successResponse(res, "Reminder slots fetched successfully", reminderSlots);
});
