const Symptoms = require("../../../models/Symptoms");
const catchAsync = require("../../../utils/catchAsync");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");

exports.getAllSymptoms = catchAsync(async (req, res, next) => {
  try {
    const symptoms = await Symptoms.find({}).select("name image").lean();

    if (!symptoms || symptoms.length === 0) {
      errorResponse(res, "No symptoms found", 200);
    }

    successResponse(res, "Symptoms retrieved successfully", {
      symptoms,
    });
  } catch (error) {
    console.error("Error in get symptoms controller:", error);
    errorResponse(res, "Failed to retrieve symptoms", 500, error);
  }
});
