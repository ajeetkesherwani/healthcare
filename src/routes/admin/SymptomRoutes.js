const express = require("express");
const router = express.Router();
const fileUploader = require("../../middlewares/fileUploader");
const {
  adminAuthenticate,
} = require("../../controllers/admin/auth/adminAuthenticate");
const {
  getSymptom,
} = require("../../controllers/admin/SymptomController/getSymptom");
const {
  createSymptom,
} = require("../../controllers/admin/SymptomController/createSymptom");
const {
  getSymptomDataById,
} = require("../../controllers/admin/SymptomController/getSymptomDataById");
const {
  updateSymptom,
} = require("../../controllers/admin/SymptomController/updateSymptom");
const {
  deleteSymptom,
} = require("../../controllers/admin/SymptomController/deleteSymptom");

router.get("/list", adminAuthenticate, getSymptom);
router.post(
  "/create",
  adminAuthenticate,
  fileUploader("category", [{ name: "image", maxCount: 1 }]),
  createSymptom
);

router.get("/getSymptomDataById/:catId", adminAuthenticate, getSymptomDataById);

router.patch(
  "/update/:id",
  adminAuthenticate,
  fileUploader("category", [{ name: "image", maxCount: 1 }]),
  updateSymptom
);
router.delete("/delete/:id", adminAuthenticate, deleteSymptom);

module.exports = router;
