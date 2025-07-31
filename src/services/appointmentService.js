const Appointment = require("../models/bookedAppointment");

module.exports = {
  async isValidAppointment(appointmentId, userId) {
    const appointment = await Appointment.findById(appointmentId);
    return (
      appointment &&
      (appointment.userId === userId || appointment.doctorId === userId)
    );
  },
};
