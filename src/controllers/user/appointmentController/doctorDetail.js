const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");
const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");

// function generateTimeSlots(
//   openingTime,
//   closingTime,
//   slotTime,
//   breakTime,
//   lunchStart,
//   lunchEnd
// ) {
//   let slots = [];
//   let currentTime = moment(openingTime, "HH:mm").tz("Asia/Kolkata");
//   while (
//     currentTime.isBefore(moment(closingTime, "HH:mm").tz("Asia/Kolkata"))
//   ) {
//     let nextTime = moment(currentTime).add(slotTime, "minutes");
//     if (
//       currentTime.isBetween(
//         moment(lunchStart, "HH:mm"),
//         moment(lunchEnd, "HH:mm"),
//         null,
//         "[)"
//       )
//     ) {
//       currentTime = moment(lunchEnd, "HH:mm");
//       continue;
//     }
//     slots.push({
//       start: currentTime.format("HH:mm"),
//       end: nextTime.format("HH:mm"),
//       status: "available",
//     });
//     currentTime = nextTime.add(breakTime, "minutes");
//   }
//   return slots;
// }

exports.doctorDetail = catchAsync(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return next(new AppError("Doctor Id is required", 400));
  }

  const doctorDetail = await Vendor.findById(id).lean();
  doctorDetail.totalPatient = "251";
  doctorDetail.rating = "4.5";
  doctorDetail.review = "50";

  // const availableSlot = generateTimeSlots(
  //   doctorDetail.openingTime,
  //   doctorDetail.closingTime,
  //   doctorDetail.slotTime,
  //   doctorDetail.breakTime,
  //   doctorDetail.lunchStart,
  //   doctorDetail.lunchEnd
  // );

  console.log(doctorDetail);

  return successResponse(
    res,
    "Doctor Detail Fetched successfully",
    doctorDetail
  );
});
