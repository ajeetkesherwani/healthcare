const express = require("express");
const router = express.Router();

const fileUploader = require("../../middlewares/fileUploader");
const {
  adminAuthenticate,
} = require("../../controllers/admin/auth/adminAuthenticate");
const {
  getVendorList,
} = require("../../controllers/admin/vendorController/getVendorList");

const {
  createVendor,
} = require("../../controllers/admin/vendorController/createVendor");
const {
  updateVendor,
} = require("../../controllers/admin/vendorController/updateVendor");
const {
  getDataById,
} = require("../../controllers/admin/vendorController/getDataById");

router.get("/list", adminAuthenticate, getVendorList);

router.post(
  "/create",
  fileUploader("vendor", [
    { name: "certificate", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),

  adminAuthenticate,
  createVendor
);
router.patch(
  "/update/:id",
  fileUploader("vendor", [
    { name: "certificate", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]),
  adminAuthenticate,
  updateVendor
);
router.get("/getDataById/:id", adminAuthenticate, getDataById);
module.exports = router;
