const express = require("express");
const {
  userAuthenticate,
} = require("../../controllers/user/authController/userAuthenticate");
const {
  bookAppointment,
} = require("../../controllers/user/bookAppointmentController/bookAppointment");
const {
  rescheduleAppointment,
} = require("../../controllers/user/bookAppointmentController/rescheduleAppointment");
const {
  cancelAppointment,
} = require("../../controllers/user/bookAppointmentController/cancelAppointment");

const router = express.Router();

router.post("/create", userAuthenticate, bookAppointment);
router.post("/reschedule/:id", userAuthenticate, rescheduleAppointment);
router.post("/cancel/:id", userAuthenticate, cancelAppointment);

module.exports = router;
