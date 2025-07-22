const mongoose = require("mongoose");

const addToCartSchema = new mongoose.Schema(
  {
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    variant: {
      value: { type: String, required: true },
      price: { type: Number, required: true },
      discountPrice: { type: Number, required: true },
      variantTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VariantType",
        required: true,
      },
    },
  },
  { timestamps: true }
);

const AddToCart = mongoose.model("AddToCart", addToCartSchema);

module.exports = AddToCart;
