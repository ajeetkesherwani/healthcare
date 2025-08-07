const BookedAppointment = require("../../../models/bookedAppointment");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const paginate = require("../../../utils/paginate");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.getBookedAppointments = catchAsync(async (req, res, next) => {
  const { page, limit, type } = req.query;

  // Default pagination options with page 1 and limit 10
  const paginationOptions = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { createdAt: -1 }, // Sort by createdAt (descending)
    // select: "status createdAt",
    populate: [
      { path: "vendor", select: "Name profileImage" },
      { path: "category", select: "name" },
    ],
  };

  let filter = {};

  // If type (status) is provided, apply the filter
  if (type) {
    const validStatuses = ["Pending", "Completed", "Cancelled"];
    const status = validStatuses.find(
      (status) => status.toLowerCase() === type.toLowerCase()
    );
    if (status) {
      filter.status = status;
    } else {
      return next(new AppError("Invalid type provided", 400));
    }
  }

  // Fetch paginated results using the paginate function
  const paginationResults = await paginate(
    BookedAppointment,
    filter,
    paginationOptions
  );

  // If no results are found, return an error
  if (!paginationResults || paginationResults.data.length === 0) {
    return next(
      new AppError("No appointments found matching the criteria", 200)
    );
  }

  // Return the paginated response
  successResponse(res, "Appointments fetched successfully", {
    data: paginationResults.data, // List of appointments
    pagination: {
      currentPage: paginationResults.currentPage,
      totalPages: paginationResults.totalPages,
      totalResults: paginationResults.totalResults,
    },
  });
});
