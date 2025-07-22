const Product = require("../../../models/products");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.productDetail = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const productDetail = await Product.findById(productId)
    .populate("serviceId", "name status image")
    .populate("categoryId", "name")
    .populate("subCategoryId", "name")
    .populate("vendor", "shopName shopId mobile profileImg");

  console.log("Product Detail:", productDetail);
  console.log(productDetail?.serviceId?._id);
  console.log(productDetail?.categoryId?._id);
  const reletedProducts = await Product.find({
    _id: { $ne: productId },
    serviceId: productDetail?.serviceId?._id,
    categoryId: productDetail?.categoryId?._id,
  }).select("name primary_image price discountedPrice");

  if (!productDetail) {
    return new AppError("Product not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Product details found",
    count: productDetail.length,
    data: productDetail,
    reletedProducts: reletedProducts,
  });
});
