const mongoose = require("mongoose");
const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

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

exports.updateVendor = catchAsync(async (req, res, next) => {
  try {
    const vendorId = req.params.id;
    const {
      category,
      type,
      Name,
      mobile,
      dob,
      gender,
      address,
      department,
      symptoms,
      qualification,
      yearOfExp,
      licOrRegNumber,
      certificate,
      profileImage,
      state,
      district,
      pincode,
      lat,
      long,
      openingTime,
      closingTime,
      lunchStart,
      lunchEnd,
      sessionTime,
      breakTime,
      selectDays,
      inClinicFee,
      videoConsultFee,
      isEmergency,
      inClinicAvaialble,
      videoConsultAvailable,
      rating,
      isBlocked,
      status,
    } = req.body;

    const files = req.files;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return next(new AppError("Vendor not found", 404));
    }
    if (mobile && mobile !== vendor.mobile) {
      const existingMobile = await Vendor.findOne({ mobile });
      if (existingMobile) {
        return next(
          new AppError(
            "Mobile number already exists. Please use a different one.",
            400
          )
        );
      }
    }

    // Handle symptoms as array or JSON string
    let symptomsArray = vendor.symptoms;
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

    let selectDaysArray = vendor.selectDays;
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

    vendor.category = category || vendor.category;
    vendor.type = type || vendor.type;
    vendor.Name = Name || vendor.Name;
    vendor.mobile = mobile || vendor.mobile;
    vendor.dob = dob || vendor.dob;
    vendor.gender = gender || vendor.gender;
    vendor.address = address || vendor.address;
    vendor.department = department
      ? Array.isArray(department)
        ? department
        : [department]
      : vendor.department;
    vendor.qualification = qualification || vendor.qualification;
    vendor.yearOfExp = yearOfExp || vendor.yearOfExp;
    vendor.symptoms = symptomsArray;
    vendor.licOrRegNumber = licOrRegNumber || vendor.licOrRegNumber;
    vendor.certificate = certificate || vendor.certificate;
    vendor.profileImage = profileImage || vendor.profileImage;
    vendor.state = state || vendor.state;
    vendor.district = district || vendor.district;
    vendor.pincode = pincode || vendor.pincode;
    vendor.lat = lat || vendor.lat;
    vendor.long = long || vendor.long;
    vendor.openingTime = openingTime || vendor.openingTime;
    vendor.closingTime = closingTime || vendor.closingTime;
    vendor.lunchStart = lunchStart || vendor.lunchStart;
    vendor.lunchEnd = lunchEnd || vendor.lunchEnd;
    vendor.sessionTime = sessionTime ? Number(sessionTime) : vendor.sessionTime;
    vendor.breakTime = breakTime ? Number(breakTime) : vendor.breakTime;
    vendor.selectDays = selectDaysArray;
    vendor.inClinicFee = inClinicFee || vendor.inClinicFee;
    vendor.videoConsultFee = videoConsultFee || vendor.videoConsultFee;
    vendor.isEmergency =
      typeof isEmergency !== "undefined" ? isEmergency : vendor.isEmergency;
    vendor.inClinicAvaialble =
      typeof inClinicAvaialble !== "undefined"
        ? inClinicAvaialble
        : vendor.inClinicAvaialble;
    vendor.videoConsultAvailable =
      typeof videoConsultAvailable !== "undefined"
        ? videoConsultAvailable
        : vendor.videoConsultAvailable;
    vendor.rating = rating || vendor.rating;
    vendor.isBlocked =
      typeof isBlocked !== "undefined" ? isBlocked : vendor.isBlocked;
    vendor.status = typeof status !== "undefined" ? status : vendor.status;

    await vendor.save();

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully.",
      vendor,
    });
  } catch (error) {
    console.error("Error saving vendor:", error);
    return new AppError(error.message, 400);
  }
});
