const Vendor = require("../../../models/vendor");
const catchAsync = require("../../../utils/catchAsync");

exports.updateProfile = catchAsync(async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const updateData = req.body;
    console.log("Received Update Data:", updateData);

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    // Only allow certain fields to be updated
    const allowedUpdates = [
      "Name",
      "mobile",
      "address",
      "profileImage",
      "department",
      "qualification",
      "yearOfExp",
      "state",
      "district",
      "pincode",
      "openingTime",
      "closingTime",
      "sessionTime",
      "breakTime",
      "lunchStart",
      "lunchEnd",
      "selectDays",
    ];

    console.log("Allowed Updates:", allowedUpdates);
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        vendor[field] = updateData[field];
      }
    });

    // Save or update the vendor document
    await vendor.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      vendor,
    });
  } catch (error) {
    console.error("Error in updateProfile controller:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
