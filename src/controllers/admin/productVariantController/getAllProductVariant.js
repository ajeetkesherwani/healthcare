const ProductVariant = require("../../../models/productVariant");

exports.getAllProductVariant = async (req, res) => {
  const { variantTypeId } = req.query; // get from query parameters

  try {
    // Build query conditionally
    const query = {};
    if (variantTypeId) {
      query.variantTypeId = variantTypeId;
    }

    const getProductVariants = await ProductVariant.find(query)
      .populate("serviceId", "name status image")
      .populate("variantTypeId", "variantName");

    if (!getProductVariants || getProductVariants.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "productVariants not found" });
    }

    res.status(200).json({
      success: true,
      message: "productVariant found",
      count: getProductVariants.length,
      data: getProductVariants,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
