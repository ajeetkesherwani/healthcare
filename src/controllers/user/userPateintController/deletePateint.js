const UserPateint = require("../../../models/userPateint");
const AppError = require("../../../utils/AppError");
const {
  successResponse,
  errorResponse,
} = require("../../../utils/responseHandler");
const catchAsync = require("../../../utils/catchAsync");

exports.deletePateint = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  const deletedPatient = await UserPateint.findByIdAndDelete(id);

  successResponse(
    res,
    "User Pateint Deleted Successfully!",
    deletedPatient,
    200
  );
});
