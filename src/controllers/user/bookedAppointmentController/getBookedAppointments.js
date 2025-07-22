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

  const paginationOptions = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    sort: { createdAt: -1 },
    populate: [
      { path: "vendor", select: "Name profileImage" },
      { path: "category", select: "name" },
    ],
  };

  let filter = {};
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

  const paginationResults = await paginate(
    BookedAppointment,
    filter,
    paginationOptions
  );

  if (!paginationResults || paginationResults.data.length === 0) {
    return next(
      new AppError("No appointments found matching the criteria", 200)
    );
  }

  successResponse(res, "Appointments fetched successfully", {
    data: paginationResults.data,
    pagination: {
      currentPage: paginationResults.currentPage,
      totalPages: paginationResults.totalPages,
      totalResults: paginationResults.totalResults,
    },
  });
});
