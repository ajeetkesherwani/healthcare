const Symptom = require("../../../models/Symptoms");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.createSymptom = catchAsync(async (req, res) => {
  console.log(req.body);
  let { name, cat_id, type, serviceId } = req.body;

  if (!name || !name.trim()) return new AppError(`name is required,`, 400);

  let imagePath;
  if (req.files && req.files.image) {
    const url = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
    imagePath = url;
  } else {
    imagePath = "";
  }

  let symptom;
  let message;
  if (cat_id) {
    symptom = new Symptom({
      name,
      image: imagePath,
      cat_id,
      type,
      serviceId,
    });
    message = "Sub Category added successfully";
  } else {
    symptom = new Symptom({ name, image: imagePath, type, serviceId });
    message = "Symptom added successfully";
  }

  await symptom.save();

  return res.status(201).json({
    status: true,
    message: message,
    data: { symptom },
  });
});
