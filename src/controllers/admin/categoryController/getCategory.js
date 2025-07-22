const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");
const paginate = require("../../../utils/paginate");

exports.getCategory = catchAsync(async (req, res) => {
  // const allCategory = await Category.find({ cat_id: null }).populate({
  //   path: "serviceId",
  //   select: "name",
  // });

  const allCategory = await paginate(
    Category,
    { cat_id: null },
    {
      page: req.query.page,
      limit: req.query.limit,
    }
  );

  return res.status(200).json({
    status: true,
    results: allCategory.length,
    data: allCategory,
  });
});
