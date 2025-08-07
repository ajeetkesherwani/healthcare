const Appointment = require("../models/bookedAppointment");

module.exports = {
  async isValidAppointment(appointmentId, userId, role) {
    const appointment = "";
    if (role == "user") {
      appointment = await Appointment.find({
        user: userId,
        _id: appointmentId,
      });
    }
    if (role == "doctor") {
      appointment = await Appointment.find({
        vendor: userId,
        _id: appointmentId,
      });
    }
    return (
      appointment &&
      (appointment.user === userId || appointment.vendor === userId)
    );
  },
  async getUserAppointmentsForToday(userId) {
    // const now = new Date();
    // const todayStart = new Date(now.setHours(0, 0, 0, 0));
    // const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    return Appointment.find({
      user: userId,
      appointmentDate: new Date(today),
    }).populate("user");
  },
  async getDoctorAppointmentsForToday(doctorId) {
    const today = new Date().toISOString().split("T")[0];
    return Appointment.find({
      vendor: doctorId,
      appointmentDate: new Date(today),
    });
  },
};
