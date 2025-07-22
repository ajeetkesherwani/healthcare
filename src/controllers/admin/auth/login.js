const bcrypt = require("bcrypt");
const Admin = require("../../../models/admin");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");
const createToken = require("../../../utils/createToken");

exports.login = catchAsync(async (req, res, next) => {
  let { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("email and password are required.", 404));
  const admin_check = await Admin.find({});
  console.log(admin_check);
  const admin = await Admin.findOne({ email });
  // console.log(await bcrypt.hash("123456", 12));
  if (!admin || !(await admin.matchPassword(password)))
    return next(new AppError("Invalid email or password.", 404));

  createToken(admin, 200, res);
});
