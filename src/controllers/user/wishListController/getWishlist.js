const Wishlist = require("../../../models/wishlist");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getWishlist = catchAsync(async(req, res, next) => {

    const { user_Id } = req.params;
     if(!user_Id){
        return next(new AppError("id is required", 400));
     }

     const getList = await Wishlist.find({ user_Id }).populate("product_Id");
     if(!getList) return next(new AppError("Wishlist not found", 404));

     res.status(200).json({ status: true, message: "Wishlist found",count: getList.length, data: getList });

});