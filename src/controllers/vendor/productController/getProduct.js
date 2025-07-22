const Product = require("../../../models/products");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.getProduct = catchAsync(async (req, res) => {
  const { vendorId } = req.vendor._id;

  console.log("Vendor ID:", vendorId);
  const allProduct = await Product.find({ vendor: vendorId })
    .populate("serviceId", "name status image")
    .populate("categoryId", "name")
    .populate("subCategoryId", "name")
    .populate("vendor", "shopName shopId mobile profileImg");

  if (!allProduct) {
    return res.status(404).json({
      success: false,
      message: "No products found for this vendor",
    });
  }

  res.status(200).json({
    success: true,
    message: "All products found for the vendor",
    count: allProduct.length,
    data: allProduct,
  });
});
