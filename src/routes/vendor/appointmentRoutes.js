const express = require("express");
const router = express.Router();

const fileUploader = require("../../middlewares/fileUploader");
const {
  vendorAuthenticate,
} = require("../../controllers/vendor/authController/vendorAuthenticate");
const {
  appointmentDetail,
} = require("../../controllers/vendor/appointmentController/appointmentDetail");
const {
  getAppointmentList,
} = require("../../controllers/vendor/appointmentController/getAppointmentList");

router.get("/list", vendorAuthenticate, getAppointmentList);
router.get("/details/:appointmentId", vendorAuthenticate, appointmentDetail);
module.exports = router;
