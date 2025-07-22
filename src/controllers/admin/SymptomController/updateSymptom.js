const Symptom = require("../../../models/Symptoms");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.updateSymptom = catchAsync(async (req, res) => {
  let symptomId = req.params.id;
  console.log((symptomId, req.body));
  let { name, cat_id, type, serviceId } = req.body;

  if (!name || !name.trim()) return new AppError(`Name is required`, 400);

  let symptom = await Symptom.findById(symptomId);
  if (!symptom) {
    return res.status(404).json({
      success: false,
      message: "Symptom not found",
    });
  }

  let imagePath = symptom.image;
  if (req.files && req.files.image) {
    const url = `${req.files.image[0].destination}/${req.files.image[0].filename}`;
    imagePath = url;
  }

  symptom.name = name || symptom.name;
  symptom.cat_id = cat_id || symptom.cat_id;
  symptom.type = type || symptom.type;
  symptom.serviceId = serviceId || symptom.serviceId;
  symptom.image = imagePath;

  await symptom.save();

  return res.status(200).json({
    status: true,
    message: "Symptom updated successfully",
    data: { symptom },
  });
});
