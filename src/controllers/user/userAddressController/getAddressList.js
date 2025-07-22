const userAddress = require("../../../models/userAddresses");
const catchAsync = require("../../../utils/catchAsync");

exports.getAddressList = catchAsync(async (req, res, next) => {
  try {
    const userId = req.user.id;

    const userAllAdd = await userAddress.find({ userId: userId });

    if (!userAllAdd || userAllAdd.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No userAddress found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "userAddress retrieved successfully",
      data: userAllAdd,
    });
  } catch (error) {
    console.error("Error in get services controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
