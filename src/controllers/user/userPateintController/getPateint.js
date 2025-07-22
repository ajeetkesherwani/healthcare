const UserPateint = require("../../../models/userPateint");
const AppError = require("../../../utils/AppError");
const { successResponse } = require("../../../utils/responseHandler");
const catchAsync = require("../../../utils/catchAsync");

exports.getPateint = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);
  const userPateintList = await UserPateint.find({ user: userId });
  successResponse(
    res,
    "User Pateint fetched Successfully!",
    userPateintList,
    200
  );
});
