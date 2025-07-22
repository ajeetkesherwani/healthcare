const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.getAllCategory = catchAsync(async (req, res, next) => {
  try {
    const categories = await Category.find({ status: "active" })
      .select("name image")
      .lean();

    if (!categories || categories.length === 0) {
      errorResponse(res, "No categories found", 200);
    }

    successResponse(res, "Categories retrieved successfully", {
      categories,
    });
  } catch (error) {
    console.error("Error in get categories controller:", error);
    errorResponse(res, "Failed to retrieve categories", 500, error);
  }
});
