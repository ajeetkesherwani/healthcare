const mongoose = require("mongoose");
const Category = require("../../../models/category");
const catchAsync = require("../../../utils/catchAsync");

exports.getCategortList = catchAsync(async (req, res) => {
  const inputSymptomIds = req.body.symptoms;

  if (!Array.isArray(inputSymptomIds) || inputSymptomIds.length === 0) {
    return res.status(400).json({
      status: false,
      message: "symptoms array is required in the request body",
    });
  }

  const symptomObjectIds = inputSymptomIds.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  const categories = await Category.aggregate([
    {
      $addFields: {
        matchedSymptoms: {
          $ifNull: [{ $setIntersection: ["$symptoms", symptomObjectIds] }, []],
        },
      },
    },
    {
      $addFields: {
        matchCount: { $size: "$matchedSymptoms" },
      },
    },
    {
      $match: {
        matchCount: { $gt: 0 }, // Only include if there's at least 1 match
      },
    },
    {
      $sort: { matchCount: -1 }, // Sort by most matches first
    },
    {
      $project: {
        name: 1,
        image: 1,
        matchedSymptoms: 1,
        matchCount: 1,
      },
    },
  ]);

  return res.status(200).json({
    status: true,
    message: "Matched categories fetched successfully",
    data: categories,
  });
});
