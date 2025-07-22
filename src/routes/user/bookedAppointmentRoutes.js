const express = require("express");
const {
  userAuthenticate,
} = require("../../controllers/user/authController/userAuthenticate");
const {
  getBookedAppointments,
} = require("../../controllers/user/bookedAppointmentController/getBookedAppointments");
const {
  bookedAppointmentDetail,
} = require("../../controllers/user/bookedAppointmentController/bookedAppointmentDetail");
const {
  updateReminder,
} = require("../../controllers/user/bookedAppointmentController/updateReminder");

const router = express.Router();

router.get("/list", userAuthenticate, getBookedAppointments);
router.get("/detail/:id", userAuthenticate, bookedAppointmentDetail);
router.patch("/updateReminder/:id", userAuthenticate, updateReminder);

module.exports = router;
