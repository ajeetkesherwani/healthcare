const ProductVariant = require("../../../models/productVariant");
const AppError = require("../../../utils/AppError");

exports.getProductVarientById = async (req, res) => {
  const id = req.params.id;

  try {
    const getProductVariants = await ProductVariant.findById(id);

    if (!getProductVariants) {
      return new AppError("productVariants not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "productVariant found",
      data: getProductVariants,
    });
  } catch (error) {
    return new AppError(error.message, 500);
  }
};
