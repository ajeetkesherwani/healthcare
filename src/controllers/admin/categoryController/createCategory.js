const Category = require("../../../models/category");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createCategory = catchAsync(async (req, res) => {
  console.log(req.body);
  let { name, cat_id, type, serviceId, symptoms } = req.body;
  console.log(symptoms);
  if (!name || !name.trim()) return new AppError(`name is required,`, 400);

  let imagePath;
  if (req.files && req.files.image) {
    const url = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
    imagePath = url;
  } else {
    imagePath = "";
  }

  // Handle symptoms as array or JSON string
  let symptomsArray = [];
  if (symptoms) {
    if (typeof symptoms === "string") {
      try {
        symptomsArray = JSON.parse(symptoms);
      } catch {
        symptomsArray = [];
      }
    } else if (Array.isArray(symptoms)) {
      symptomsArray = symptoms;
    }
  }

  const categoryData = {
    name,
    image: imagePath,
    type,
    serviceId,
    symptoms: symptomsArray,
  };
  if (cat_id) categoryData.cat_id = cat_id;

  const category = new Category(categoryData);
  let message = cat_id
    ? "Sub Category added successfully"
    : "Category added successfully";

  await category.save();

  return res.status(201).json({
    status: true,
    message: message,
    data: { category },
  });
});
