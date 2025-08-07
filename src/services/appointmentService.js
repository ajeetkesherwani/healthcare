const Appointment = require("../models/bookedAppointment");

module.exports = {
  async isValidAppointment(appointmentId, userId) {
    const appointment = await Appointment.findById(appointmentId);
    return (
      appointment &&
      (appointment.userId === userId || appointment.doctorId === userId)
    );
  },
  async getUserAppointmentsForToday() {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const todayEnd = new Date(now.setHours(23, 59, 59, 999));

    return Appointment.find({
      appointmentDate: { $gte: todayStart, $lte: todayEnd },
    }).populate("user");
  },
};
