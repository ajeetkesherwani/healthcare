const Symtomps = require("../../../models/Symptoms");
const catchAsync = require("../../../utils/catchAsync");

exports.symtomsList = catchAsync(async (req, res) => {
  console.log("Symptoms list function loaded");

  const searchTerm = req.params.name?.trim();

  if (!searchTerm) {
    return new AppError(400, "Search term is required in the URL parameter");
  }

  try {
    const symtomps = await Symtomps.find({
      name: { $regex: searchTerm, $options: "i" },
    }).select("name description");

    return res.status(200).json({
      success: true,
      message: "Symptoms data fetched successfully",
      symtomps,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching symptoms data.",
      error: error.message,
    });
  }
});
