const Banners = require("../../../models/banners");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getBanner = catchAsync(async(req, res, next) => {

    const banner = await Banners.find();
    if(!banner) return next(new AppError("Banner not found found", 404));

    res.status(200).json({ status: true, message: "Banners found",count: banner.length, data: banner })

});