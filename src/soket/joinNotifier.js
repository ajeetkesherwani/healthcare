const cron = require("node-cron");
const Appointment = require("../models/bookedAppointment");
const redis = require("../utils/redisClient");
// const { sendPushNotification } = require("../utils/firebaseService"); // <-- Your Firebase function

module.exports = function (io) {
  cron.schedule("*/10 * * * * *", async () => {
    console.log("Running joinNotifier cron job");
    try {
      const now = new Date();
      const in30Sec = new Date(now.getTime() + 30 * 1000);
      const today = now.toISOString().split("T")[0];

      const upcomingAppointments = await Appointment.find({
        appointmentDate: { $eq: new Date(today) },
      }).populate("user"); // populate user info (tokens, etc.)

      for (const appointment of upcomingAppointments) {
        const [startTimeStr] = appointment.timeSlot.split(" - ");
        const appointmentStart = new Date(appointment.appointmentDate);
        const [hours, minutes] = startTimeStr.split(":").map(Number);
        appointmentStart.setHours(hours, minutes, 0, 0);

        if (appointmentStart < now || appointmentStart > in30Sec) continue;

        const redisKey = `notified:${appointment._id}`;
        const alreadyNotified = await redis.get(redisKey);

        if (!alreadyNotified) {
          // 1️⃣ Push Notification
          if (appointment.user?.fcmToken) {
            // await sendPushNotification(
            //   appointment.user.fcmToken,
            //   "Upcoming Appointment",
            //   "Your call starts in 30 seconds"
            // );
            console.log(
              `🔔 Sent push notification for appointment ${appointment._id} at ${startTimeStr}`
            );
          }

          // 2️⃣ Socket Event for Live UI Update
          io.to(`user:${appointment.user._id}`).emit("enable-join-button", {
            appointmentId: appointment._id,
            joinAvailable: true,
          });

          console.log(
            `🔔 Sent notifications for appointment ${appointment._id} at ${startTimeStr}`
          );

          await redis.set(redisKey, "1", "EX", 60);
        }
      }
    } catch (err) {
      console.error("❌ Error in joinNotifier:", err);
    }
  });
};

// // src/soket/joinNotifier.js
// const cron = require("node-cron");
// const Appointment = require("../models/bookedAppointment");

// module.exports = function (io) {
//   cron.schedule("*/10 * * * * *", async () => {
//     const now = new Date();
//     const in30Sec = new Date(now.getTime() + 30 * 1000);
//     const today = now.toISOString().split("T")[0];

//     const upcomingAppointments = await Appointment.find({
//       appointmentDate: { $eq: new Date(today) },
//     });
//     console.log("🔔 Checking for upcoming appointments...");
//     console.log(`🔔 Found ${upcomingAppointments} upcoming appointments`);
//     for (const appointment of upcomingAppointments) {
//       const [startTimeStr] = appointment.timeSlot.split(" - ");

//       const appointmentDate = new Date(appointment.appointmentDate);
//       const [hours, minutes] = startTimeStr.split(":").map(Number);
//       appointmentDate.setHours(hours, minutes, 0, 0);
//       console.log("now:", now);
//       console.log("in30Sec:", in30Sec);
//       console.log("appointmentDate:", appointmentDate);
//       const notifiedAppointments = new Set();

//       if (
//         appointmentDate >= now &&
//         appointmentDate <= in30Sec &&
//         !notifiedAppointments.has(appointment._id.toString())
//       ) {
//         io.to(appointment._id.toString()).emit("appointment-join-soon", {
//           message: "Your call starts in 30 seconds",
//           appointmentId: appointment._id,
//         });
//         console.log(
//           `🔔 Sent join-soon notification for appointment ${appointment._id} at ${startTimeStr}`
//         );

//         notifiedAppointments.add(appointment._id.toString());

//         // remove from set after 1 min
//         setTimeout(() => {
//           notifiedAppointments.delete(appointment._id.toString());
//         }, 60000);
//       } else {
//         console.log(`⏩ This appointment is not within the next 30 seconds`);
//       }
//     }
//   });
// };
