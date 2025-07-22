const Setting = require("../../../models/setting");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createSetting = catchAsync(async (req, res, next) => {
    const { brandName,
        commission,
        gst,
        onboardingFee,
        plateformFee,
        finalPlateformFee,
        agreement,
        email,
        mobile,
        address, } = req.body;

    if (!brandName || !commission ||
        !onboardingFee || !plateformFee
        || !finalPlateformFee || !agreement || !email || !mobile || !address) {
        return next(new AppError("all fields are required", 400));
    }


    const logoFile = req?.files?.logo?.[0];
    const logo = logoFile?.path || "";


    const setting = new Setting({
        brandName, logo, commission, gst, onboardingFee, plateformFee, finalPlateformFee,
        agreement, email, mobile, address
    });

    await setting.save();

    res.status(200).json({ status: true, message: " Setting created successfully", data: setting });


});