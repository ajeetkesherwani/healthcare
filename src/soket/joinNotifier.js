const cron = require("node-cron");
const io = require("../server").io;
const Appointment = require("../models/Appointment");

cron.schedule("* * * * *", async () => {
  const now = new Date();
  const in30Sec = new Date(now.getTime() + 30 * 1000);

  const today = now.toISOString().split("T")[0]; // Format: YYYY-MM-DD

  const upcomingAppointments = await Appointment.find({
    appointmentDate: { $eq: new Date(today) },
  });

  for (const appointment of upcomingAppointments) {
    const [startTimeStr] = appointment.timeSlot.split(" - "); // e.g., "12:40"

    // Combine appointmentDate + startTime
    const appointmentDate = new Date(appointment.appointmentDate);
    const [hours, minutes] = startTimeStr.split(":").map(Number);

    appointmentDate.setHours(hours);
    appointmentDate.setMinutes(minutes);
    appointmentDate.setSeconds(0);
    appointmentDate.setMilliseconds(0);

    // Now check if this call starts in the next 30 seconds
    if (appointmentDate >= now && appointmentDate <= in30Sec) {
      io.to(appointment._id.toString()).emit("appointment-join-soon", {
        message: "Your call starts in 30 seconds",
        appointmentId: appointment._id,
      });
      console.log(
        `🔔 Sent join-soon notification for appointment ${appointment._id} at ${startTimeStr}`
      );
    }
  }
});
