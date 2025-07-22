const OrderAddress = require("../../../models/OrderAddress");
const MainOrder = require("../../../models/mainOrder");
const SubOrder = require("../../../models/SubOrder");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/AppError");

const saveOrderAddress = async (address) => {
  return await new OrderAddress(address).save();
};

const createSubOrder = async (
  vendorId,
  products,
  coupon = null,
  mainOrderId
) => {
  const { items, subTotal, gstTotal } = calculateProductDetails(products);
  const couponDiscount = coupon?.discountAmount || 0;

  const subOrder = new SubOrder({
    mainOrderId,
    vendorId,
    products: items,
    subTotal,
    totalGST: gstTotal,
    totalAmount: subTotal + gstTotal - couponDiscount,
    coupon: {
      code: coupon?.code || null,
      discountAmount: couponDiscount,
    },
    couponDiscount,
    vendorPayout: {
      amount: subTotal + gstTotal - couponDiscount,
      status: "pending",
    },
  });

  await subOrder.save();

  return {
    subOrder,
    total: subOrder.totalAmount,
    gst: gstTotal,
    discount: couponDiscount,
    couponSummary: coupon?.code
      ? {
          vendorId,
          code: coupon.code,
          discountAmount: couponDiscount,
        }
      : null,
  };
};

const calculateProductDetails = (products) => {
  let subTotal = 0;
  let gstTotal = 0;
  const items = products.map((item) => {
    const gstRate = item.gstPercentage || 0;
    const price = item.discountedPrice || item.price;
    const totalItemAmount = price * item.quantity;
    const gstAmount = (gstRate / 100) * totalItemAmount;

    subTotal += totalItemAmount;
    gstTotal += gstAmount;

    return {
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      variant: item.variant,
      price: item.price,
      discountedPrice: item.discountedPrice,
      gstPercentage: gstRate,
      gstAmount,
      totalItemAmount,
    };
  });

  return { items, subTotal, gstTotal };
};

exports.createOrder = catchAsync(async (req, res, next) => {
  const { address, paymentMethod, cart } = req.body;
  const user_Id = req.user.id;

  if (!cart || cart.length === 0) {
    return next(new AppError("Cart is empty", 400));
  }

  const orderAddress = await saveOrderAddress(address);

  const orderNumber = "ORD-" + Date.now();
  const mainOrder = new MainOrder({
    user_Id,
    orderNumber,
    totalAmount: 0,
    totalGST: 0,
    totalDiscount: 0,
    paymentMethod,
    paymentStatus: paymentMethod === "COD" ? "pending" : "paid",
    couponSummary: [],
    address: orderAddress._id,
  });

  await mainOrder.save();

  let totalAmount = 0;
  let totalGST = 0;
  let totalDiscount = 0;
  let subOrderIds = [];
  let couponSummary = [];

  for (const vendorCart of cart) {
    const { vendorId, products, coupon } = vendorCart;

    const {
      subOrder,
      total,
      gst,
      discount,
      couponSummary: cSummary,
    } = await createSubOrder(vendorId, products, coupon, mainOrder._id);

    subOrderIds.push(subOrder._id);
    totalAmount += total;
    totalGST += gst;
    totalDiscount += discount;
    if (cSummary) couponSummary.push(cSummary);
  }

  mainOrder.totalAmount = totalAmount;
  mainOrder.totalGST = totalGST;
  mainOrder.totalDiscount = totalDiscount;
  mainOrder.couponSummary = couponSummary;

  await mainOrder.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    orderId: mainOrder._id,
    subOrders: subOrderIds,
  });
});
