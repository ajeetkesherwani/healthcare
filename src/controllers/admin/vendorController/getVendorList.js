const Vendor = require("../../../models/vendor");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.getVendorList = async (req, res) => {
  try {
    const allVendor = await Vendor.find()
      .populate("category", "name")
      .select(
        "category Name department wallet_balance isBlocked status profileImage createdAt"
      );
    if (!allVendor) {
      return res
        .status(400)
        .json({ success: false, message: "Vendor not found" });
    }

    const data = {
      count: allVendor.length,
      AllVendors: allVendor,
    };

    return successResponse(res, "All vendors found", data);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
