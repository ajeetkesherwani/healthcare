const Symptom = require("../../../models/Symptoms");
const catchAsync = require("../../../utils/catchAsync");
const paginate = require("../../../utils/paginate");

exports.getSymptom = catchAsync(async (req, res) => {
  const allSymptom = await Symptom.find();

  return res.status(200).json({
    status: true,
    results: allSymptom.length,
    data: allSymptom,
  });
});
