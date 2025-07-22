const UserPateint = require("../../../models/userPateint");
const AppError = require("../../../utils/AppError");
const { successResponse } = require("../../../utils/responseHandler");
const catchAsync = require("../../../utils/catchAsync");

exports.createPateint = catchAsync(async (req, res, next) => {
  const user = req.user.id;
  const { name } = req.body;

  if (!name) return next(new AppError("Name is required", 400));

  const newUserPateint = new UserPateint({ user, name });

  await newUserPateint.save();

  successResponse(res, "User Pateint Added Successfully!", newUserPateint, 200);
});
