const Vendor = require("../../../models/vendor");
const paginate = require("../../../utils/paginate"); // adjust the path as needed
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.getVendorList = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const query = {
      status: true,
      isBlocked: false,
    };
    const options = {
      page,
      limit,
      select:
        "category Name department wallet_balance isBlocked status profileImage createdAt",
      populate: { path: "category", select: "name" },
      sort: { createdAt: -1 }, // Example: latest vendors first
    };

    const paginatedVendors = await paginate(Vendor, query, options);

    return successResponse(
      res,
      "Vendors retrieved successfully",
      paginatedVendors
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
