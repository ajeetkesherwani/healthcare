const Symptoms = require("../../../models/Symptoms");
const Category = require("../../../models/category");
const Vendor = require("../../../models/vendor");
const VariantType = require("../../../models/variantType");
const ProductVariant = require("../../../models/productVariant");
const AppError = require("../../../utils/AppError");

exports.getList = async (req, res, next) => {
  const { type } = req.params;
  const { serviceId } = req.query;
  console.log("getList called with type:", type, "and serviceId:", serviceId);
  const typeMap = {
    symptoms: { model: Symptoms, select: "name", applyFilter: false },
  };

  try {
    if (!typeMap[type]) {
      return next(new AppError("Invalid type provided", 400));
    }

    const { model, select, applyFilter } = typeMap[type];

    let query = {};

    const list = await model.find(query).select(select);

    res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data: list,
    });
  } catch (error) {
    console.error("getList Error:", error);
    next(new AppError("Failed to fetch data", 500));
  }
};
