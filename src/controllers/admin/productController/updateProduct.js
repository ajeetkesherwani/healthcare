const Product = require("../../../models/products");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

const validateRequiredField = (field, fieldName) => {
  if (!field || !field.trim())
    return new AppError(`${fieldName} is required.`, 400);
  return null;
};

const generateSKU = (prefix = "PRE", length = 6) => {
  const randomString = Math.random()
    .toString(36)
    .substring(2, 2 + length)
    .toUpperCase();
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.T]/g, "")
    .slice(0, 14); // YYYYMMDDHHMMSS

  return `${prefix}-${timestamp}-${randomString}`;
};

exports.updateProduct = catchAsync(async (req, res) => {
  console.log(req.body);
  try {
    const { productId } = req.params; // Assuming productId is passed as a route parameter
    const {
      vendor,
      serviceId,
      categoryId,
      subCategoryId,
      fabricId,
      name,
      primary_image,
      gallery_images,
      price,
      discountedPrice,
      returnAvailable,
      exchangeAvailable,
      variants,
      shortDiscription,
      longDiscription,
      tags,
    } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.vendor = vendor || product.vendor;
    product.serviceId = serviceId || product.serviceId;
    product.categoryId = categoryId || product.categoryId;
    product.subCategoryId = subCategoryId || product.subCategoryId;
    product.fabricId = fabricId || product.fabricId;
    product.name = name || product.name;
    product.price = price || product.price;
    product.discountedPrice = discountedPrice || product.discountedPrice;
    product.returnAvailable = returnAvailable || product.returnAvailable;
    product.exchangeAvailable = exchangeAvailable || product.exchangeAvailable;
    product.shortDiscription = shortDiscription || product.shortDiscription;
    product.longDiscription = longDiscription || product.longDiscription;
    product.tags = tags ? JSON.parse(tags) : product.tags;
    product.variants = variants ? JSON.parse(variants) : product.variants;

    if (req.files && req.files.primary_image) {
      const url = `${req.files.primary_image[0].destination}/${req.files.primary_image[0].filename}`;
      product.primary_image = url;
    }

    if (req.files && req.files.gallery_images) {
      const imagesUrls = req.files.gallery_images.map((file) => {
        return `${file.destination}/${file.filename}`;
      });
      product.gallery_images = imagesUrls;
    }

    product.sku = product.sku || generateSKU();
    if (req.body.sku) {
      product.sku = req.body.sku;
    }

    // Save the updated product
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});
