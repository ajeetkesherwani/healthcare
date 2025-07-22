const Category = require("../../../models/category");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateCategory = catchAsync(async (req, res) => {
  let categoryId = req.params.id;
  console.log(categoryId);
  let { name, cat_id, type, serviceId, symptoms } = req.body;

  // if (!name || !name.trim()) return new AppError(`Name is required`, 400);

  let category = await Category.findById(categoryId);
  if (!category) {
    return new AppError(404, "Category not found");
  }
  console.log(category);
  let imagePath = category.image;
  if (req.files && req.files.image) {
    const url = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
    imagePath = url;
  }
  console.log("all initalization done");
  category.name = name || category.name;
  category.cat_id = cat_id || category.cat_id;
  category.type = type || category.type;
  category.serviceId = serviceId || category.serviceId;
  category.image = imagePath;

  // Handle symptoms as array or JSON string
  let symptomsArray = category.symptoms;
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
  category.symptoms = symptomsArray;

  await category.save();
  console.log("execution done");
  return res.status(200).json({
    status: true,
    message: "Category updated successfully",
    data: { category },
  });
});
