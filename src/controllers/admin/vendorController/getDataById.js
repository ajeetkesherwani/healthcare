const Vendor = require("../../../models/vendor");
const AppError = require("../../../utils/AppError");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.getDataById = async (req, res) => {
  const id = req.params.id;
  try {
    const vendorData = await Vendor.findById(id);
    if (!vendorData) {
      return errorResponse(res, 400, "Vendor not found");
    }

    successResponse(res, "Vendor found", vendorData);
  } catch (error) {
    errorResponse(res, 500, error.message);
  }
};
