const AddToCart = require("../../../models/addToCart");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createAddtocart = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const user_Id = req.user.id;
  const { product_Id, vendorId, pro_qty, variant } = req.body;

  if (!product_Id) return next(new AppError("product_Id is required", 400));
  if (!vendorId) return next(new AppError("vendorId is required", 400));
  if (!pro_qty) return next(new AppError("pro_qty is required", 400));
  if (!variant) return next(new AppError("variant is required", 400));

  const existingCart = await AddToCart.findOne({
    user_Id,
    product_Id,
  });
  if (existingCart) {
    existingCart.quantity = String(Number(pro_qty));
    existingCart.variant = variant;
    await existingCart.save();
    return res.status(200).json({
      status: true,
      message: "existingCart updated successfully",
      data: existingCart,
    });
  }

  const newAddtocart = new AddToCart({
    user_Id,
    product_Id,
    vendorId,
    quantity: pro_qty,
    variant,
  });

  await newAddtocart.save();

  res.status(200).json({
    status: true,
    message: "new addToCart added successfully",
    data: newAddtocart,
  });
});
