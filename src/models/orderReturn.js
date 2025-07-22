const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  bankName: { type: String, required: true },
  branchName: { type: String, required: true },
  ifscCode: { type: String, required: true },
  accountNo: { type: String, required: true },
  holderName: { type: String, required: true },
});

const orderReturnSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MainOrder",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    returnReason: {
      type: String,
      trim: true,
      required: true,
    },
    uploadFiles: [{ type: String, required: true }],
    returnMessage: {
      type: String,
      trim: true,
      required: true,
    },
    is_refundToSourceAccount: { type: Boolean, default: false },
    refundNewAccount: {
      type: accountSchema,
      required: false,
    },
    orderStatus: {
      type: String,
      enum: [
        "requestSubmitted",
        "requestApproved",
        "pickUp",
        "inReview",
        "completed",
        "rejected",
      ],
      default: "requestSubmitted",
    },
  },
  { timestamps: true }
);

// Add custom pre-validation hook
orderReturnSchema.pre("validate", function (next) {
  if (!this.is_refundToSourceAccount && !this.refundNewAccount) {
    return next(
      new Error(
        "refundNewAccount is required if refund is not to source account"
      )
    );
  }
  next();
});

const OrderReturn = mongoose.model("OrderReturn", orderReturnSchema);

module.exports = OrderReturn;
