const VariantType = require("../../../models/variantType");

exports.allVariant = async (req, res) => {
  try {
    const variants = await VariantType.find().populate("serviceId", "name");
    if (!variants)
      return res
        .status(400)
        .json({ success: false, message: "varintType not found" });

    res.status(200).json({
      success: true,
      message: "variantType found",
      count: variants.length,
      data: variants,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
