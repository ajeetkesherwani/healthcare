const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.getProfile = catchAsync(async (req, res) => {
  const vendorId = req.vendor._id;

  const vendor = await Vendor.findById(vendorId).populate({
    path: "category",
    select: "name",
  });

  if (!vendor) {
    return errorResponse(res, 404, "Vendor not found");
  }

  successResponse(res, "Profile fetched successfully", vendor);
});
