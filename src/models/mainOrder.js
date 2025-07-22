const mongoose = require("mongoose");

const mainOrderSchema = new mongoose.Schema(
  {
    user_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderNumber: { type: String, unique: true, required: true },

    totalAmount: { type: Number, required: true }, // grand total
    totalGST: { type: Number, required: true },
    totalDiscount: { type: Number, default: 0 }, // combined coupon discount
    deliveryCharge: { type: Number, default: 0 },
    deliveryGST: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "placed",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ],
      default: "placed",
    },

    couponSummary: [
      {
        vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
        code: String,
        discountAmount: { type: Number, default: 0 },
      },
    ],

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderAddress",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MainOrder", mainOrderSchema);
