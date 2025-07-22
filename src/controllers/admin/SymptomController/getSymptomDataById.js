const Symptom = require("../../../models/Symptoms");
const catchAsync = require("../../../utils/catchAsync");

exports.getSymptomDataById = catchAsync(async (req, res) => {
  const id = req.params.catId;
  const getDataById = await Symptom.findById(id);

  return res.status(200).json({
    status: true,
    data: getDataById,
  });
});
