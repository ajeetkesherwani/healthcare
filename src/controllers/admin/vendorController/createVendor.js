const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const bcrypt = require("bcrypt");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

const processImages = (files, fieldName) => {
  if (files && files[fieldName]) {
    if (Array.isArray(files[fieldName])) {
      return files[fieldName].map((file) => file.path);
    } else {
      return [files[fieldName].path];
    }
  }
  return [];
};

const validateRequiredField = (field, fieldName) => {
  if (!field || !field.trim())
    return new AppError(`${fieldName} is required.`, 400);
  return null;
};

exports.createVendor = catchAsync(async (req, res, next) => {
  let {
    category,
    Name,
    mobile,
    dob,
    gender,
    address,
    department,
    qualification,
    yearOfExp,
    symptoms,
    licOrRegNumber,
    state,
    district,
    pincode,
    lat,
    long,
    startTime,
    endTime,
    isEmergency,
    inClinicAvaialble,
    videoConsultAvailable,
    openingTime,
    closingTime,
    lunchStart,
    lunchEnd,
    sessionTime,
    breakTime,
    selectDays,
    inClinicFee,
    videoConsultFee,
  } = req.body;

  const files = req.files;

  // Process images
  const certificate = processImages(files, "certificate")[0] || "";
  const profileImage = processImages(files, "profileImage")[0] || "";

  const requiredFields = [
    { field: Name, name: "Full Name" },
    { field: mobile, name: "Mobile" },
    { field: dob, name: "Date of Birth" },
    { field: gender, name: "Gender" },
    { field: qualification, name: "Qualification" },
  ];

  for (const { field, name } of requiredFields) {
    const error = validateRequiredField(field, name);
    if (error) return next(error);
  }

  const existingMobile = await Vendor.findOne({ mobile });
  if (existingMobile)
    return next(
      new AppError(
        "Mobile number already exists. Please use a different one.",
        400
      )
    );

  let symptomsArray = [];
  if (symptoms) {
    if (typeof symptoms === "string") {
      try {
        symptomsArray = JSON.parse(symptoms);
      } catch {
        symptomsArray = [];
      }
    } else if (Array.isArray(symptoms)) {
      symptomsArray = symptoms;
    }
  }

  let selectDaysArray = [];
  if (selectDays) {
    if (typeof selectDays === "string") {
      try {
        selectDaysArray = JSON.parse(selectDays);
      } catch {
        selectDaysArray = [];
      }
    } else if (Array.isArray(selectDays)) {
      selectDaysArray = selectDays;
    }
  }

  const newVendor = await Vendor.create({
    category,
    type: req.type || "doctor",
    Name,
    mobile,
    dob,
    gender,
    address,
    department: Array.isArray(department) ? department : [department],
    qualification,
    symptoms: symptomsArray,
    yearOfExp,
    licOrRegNumber,
    certificate,
    profileImage,
    state,
    district,
    pincode,
    lat,
    long,
    startTime: startTime || "10:00 AM",
    endTime: endTime || "09:00 PM",
    openingTime: openingTime || "10:00 AM",
    closingTime: closingTime || "09:00 PM",
    lunchStart: lunchStart || "",
    lunchEnd: lunchEnd || "",
    sessionTime: sessionTime ? Number(sessionTime) : 30,
    breakTime: breakTime ? Number(breakTime) : 0,
    selectDays: selectDaysArray,
    commission: 0,
    wallet_balance: 0,
    agreementAccepted: "true",
    rating: rating || 0,
    isBlocked: isBlocked || false,
    status: false,
    isEmergency,
    inClinicAvaialble,
    videoConsultAvailable,
    inClinicFee: inClinicFee || 0,
    videoConsultFee: videoConsultFee || 0,
  });

  successResponse(res, "Vendor registered successfully.", newVendor);
});
