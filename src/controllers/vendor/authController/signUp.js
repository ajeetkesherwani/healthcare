const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const { successResponse } = require("../../../utils/responseHandler");
const validateRequiredFields = require("../../../utils/validateRequiredFields");

// Image handler
const processSingleImage = (files, fieldName) => {
  if (files && files[fieldName] && files[fieldName][0]) {
    return files[fieldName][0].path;
  }
  return "";
};

exports.signUp = catchAsync(async (req, res, next) => {
  const {
    Name,
    mobile,
    dob,
    gender,
    category,
    qualification,
    type, // doctor / ambulance / other
    address,
    department,
    yearOfExp,
    licOrRegNumber,
    state,
    district,
    pincode,
    inClinicAvaialble,
    videoConsultAvailable,
    inClinicFee,
    videoConsultFee,
    symptoms,
  } = req.body;

  // ✅ Validate required fields
  if (!Name || !Name.trim()) return next(new AppError("Name is required", 400));
  if (!mobile || !mobile.trim())
    return next(new AppError("Mobile is required", 400));
  if (!gender || !["male", "female", "other"].includes(gender))
    return next(new AppError("Valid gender is required", 400));
  if (!qualification || !qualification.trim())
    return next(new AppError("Qualification is required", 400));

  const requiredFields = [
    { field: Name, name: "Name" },
    { field: mobile, name: "Mobile Number" },
    { field: gender, name: "Gender" },
    { field: qualification, name: "Qualification" },
    { field: category, name: "Category" },
    { field: yearOfExp, name: "Year of experience" },
  ];

  // ✅ Centralized validation
  validateRequiredFields(requiredFields, next);

  const files = req.files;
  const profileImage = processSingleImage(files, "profileImage");
  const certificate = processSingleImage(files, "certificate");

  // ✅ Build vendor data object
  const vendorData = {
    Name,
    dob,
    gender,
    category,
    qualification,
    type: type || "other",
    address,
    department,
    yearOfExp,
    licOrRegNumber,
    certificate,
    profileImage,
    state,
    district,
    pincode,
    inClinicAvaialble: inClinicAvaialble || false,
    videoConsultAvailable: videoConsultAvailable || false,
    inClinicFee: inClinicFee || 0,
    videoConsultFee: videoConsultFee || 0,
    symptoms,
  };

  // Remove undefined or empty fields from vendorData
  Object.keys(vendorData).forEach((key) => {
    if (
      vendorData[key] === undefined ||
      vendorData[key] === null ||
      vendorData[key] === ""
    ) {
      delete vendorData[key];
    }
  });

  // ✅ Check if vendor exists
  const existingVendor = await Vendor.findOne({ mobile });

  let resultVendor;
  if (existingVendor) {
    // ✅ Update existing vendor
    resultVendor = await Vendor.findOneAndUpdate(
      { mobile },
      { $set: vendorData },
      { new: true }
    );
  } else {
    // ✅ Create new vendor
    vendorData.mobile = mobile;
    resultVendor = await Vendor.create(vendorData);
  }

  return successResponse(res, "Vendor registered or updated successfully", {
    vendor: resultVendor,
  });
});
