const Symptom = require("../../../models/Symptoms");
const AppError = require("../../../utils/AppError");
const catchAsync = require("../../../utils/catchAsync");

exports.deleteSymptom = catchAsync(async (req, res) => {
  const id = req.params.id;

  if (!id || !id.trim()) {
    return new AppError(`Id is required.`, 400);
  }

  const deleteSymptom = await Symptom.findByIdAndDelete(id);
  if (!deleteSymptom) {
    return new AppError(`Symptom not found.`, 400);
  }

  return res.status(200).json({
    status: true,
    message: "Symptom Deleted successfully",
  });
});
