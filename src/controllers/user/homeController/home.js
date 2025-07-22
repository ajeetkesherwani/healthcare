const Symtomps = require("../../../models/Symptoms");
const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.home = catchAsync(async (req, res) => {
  console.log("Function loaded");
  let upcomingAppointment = [];
  let dailyDoseReinder = [];
  let categories = [];
  let symtomps = [];

  try {
    categories = await Category.find({
      cat_id: { $exists: false },
    })
      .select("name image")
      .exec();

    symtomps = await Symtomps.find({}).select("name image");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching data.",
      error: error.message,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Home data fetched successfully",
    data: {
      upcomingAppointment: upcomingAppointment,
      dailyDoseReinder: dailyDoseReinder,
      categories: categories,
      symtomps: symtomps,
    },
  });
});
