const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");
const paginate = require("../../../utils/paginate");

exports.getCategory = catchAsync(async (req, res) => {
  const { page, limit, type } = req.query;
  const paginationOptions = {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    sort: { createdAt: -1 },
    populate: [{ path: "vendor", select: "Name profileImage" }],
  };

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
