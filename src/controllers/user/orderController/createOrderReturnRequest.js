const OrderReturn = require("../../../models/orderReturn");
const MainOrder = require("../../../models/mainOrder");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

const validateRequiredField = (field, fieldName) => {
  if (!field || !field.trim())
    return new AppError(`${fieldName} is required.`, 400);
  return null;
};

exports.createOrderReturnRequest = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const {
    orderId,
    returnReason,
    returnMessage,
    is_refundToSourceAccount,
    refundNewAccount,
  } = req.body;

  // Validate fields
  const requiredFields = [
    { field: orderId, name: "Order Id" },
    { field: returnReason, name: "Return Reason" },
    { field: returnMessage, name: "Return Message" },
    { field: is_refundToSourceAccount, name: "Is Refund To Source Account" },
  ];

  for (const { field, name } of requiredFields) {
    const error = validateRequiredField(field, name);
    if (error) return next(error);
  }

  if (!is_refundToSourceAccount && !refundNewAccount) {
    return next(
      new AppError(
        "Refund account details required if not refunding to source account",
        400
      )
    );
  }

  let uploadFiles = [];
  if (req.files && req.files.uploadFiles) {
    uploadFiles = req.files.uploadFiles.map((file) => {
      return `${file.destination}/${file.filename}`;
    });
  }

  // Create return request
  const returnRequest = new OrderReturn({
    orderId,
    userId,
    returnReason,
    returnMessage,
    uploadFiles,
    is_refundToSourceAccount,
    refundNewAccount: is_refundToSourceAccount ? undefined : refundNewAccount,
  });

  // Fetch and update main order
  //   const mainOrder = await MainOrder.findById(orderId);
  //   if (!mainOrder) {
  //     return next(new AppError("Main order not found", 404));
  //   }

  //   mainOrder.orderStatus = "returned";

  // Save both
  await returnRequest.save();
  //   await mainOrder.save();

  // Send success response
  res.status(201).json({
    success: true,
    message: "Return request created successfully",
    data: returnRequest,
  });
});
