const Delas = require("../../../models/dealsOfTheDay");

exports.getDealsOfTheDay = async (req, res) => {
  try {
    const delas = await Delas.find()
      .populate("product_id", "name price image")
      .populate("cat_id", "name")
      .populate("serviceId", "name")
      .sort({ createdAt: -1 });
    if (!delas) {
      return res
        .status(400)
        .json({ success: false, message: "Deals not found" });
    }

    res.status(200).json({
      success: true,
      message: "Deals of the data fetched successfully",
      count: delas.length,
      data: delas,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
