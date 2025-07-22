const express = require("express");
const router = express.Router();
const {
  userAuthenticate,
} = require("../../controllers/user/authController/userAuthenticate");

const {
  getCategortList,
} = require("../../controllers/user/appointmentController/getCategortList");
const {
  getDoctorList,
} = require("../../controllers/user/appointmentController/getDoctorList");
const {
  doctorDetail,
} = require("../../controllers/user/appointmentController/doctorDetail");
const {
  getAvailableSlots,
} = require("../../controllers/user/appointmentController/slotGenerator");
const {
  getReminderSlots,
} = require("../../controllers/user/appointmentController/getReminderSlots");

router.post("/getCategortList", userAuthenticate, getCategortList);
router.post("/getDoctorList", userAuthenticate, getDoctorList);
router.get("/doctorDetail/:id", userAuthenticate, doctorDetail);
router.get("/slots", userAuthenticate, getAvailableSlots);
router.get("/reminderSlots", userAuthenticate, getReminderSlots);
module.exports = router;
