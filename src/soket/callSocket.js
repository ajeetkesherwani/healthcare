const callState = require("./callStateManager");
const appointmentService = require("../services/appointmentService");

module.exports = function (io) {
  io.on("connection", (socket) => {
    const user = socket.user; // comes from auth middleware
    const userId = user.id;
    const role = user.role;

    console.log(
      "Socket connected:",
      socket.id,
      "User ID:",
      userId,
      "Role:",
      role
    );

    const intervalId = setInterval(() => {
      socketEmittForTodayAppointment(socket, userId, role);
    }, 5000);

    socketEmittForTodayAppointment(socket, userId, role);

    socket.on("join-call", async ({ appointmentId }) => {
      try {
        console.log(`${role} ${userId} joined appointment ${appointmentId}`);
        const appointment = await appointmentService.isValidAppointment(
          appointmentId,
          userId,
          role
        );
        if (!appointment) {
          return socket.emit("call-error", {
            message: "Appointment not found.",
          });
        }

        const isValidUser =
          role === "user" && appointment.user.toString() === userId;
        const isValidDoctor =
          role === "doctor" && appointment.vendor.toString() === userId;

        console.log("isValidUser:", isValidUser);
        console.log("isValidDoctor:", isValidDoctor);
        if (!isValidUser && !isValidDoctor) {
          return socket.emit("call-error", {
            message: "You are not authorized to join this appointment.",
          });
        }

        const [startTimeStr, endTimeStr] = appointment.timeSlot.split(" - ");
        const appointmentDate = new Date(appointment.appointmentDate);

        const [startHour, startMinute] = startTimeStr.split(":").map(Number);
        const [endHour, endMinute] = endTimeStr.split(":").map(Number);

        const slotStart = new Date(appointmentDate);
        slotStart.setUTCHours(startHour, startMinute, 0, 0);

        const slotEnd = new Date(appointmentDate);
        slotEnd.setUTCHours(endHour, endMinute, 0, 0);

        const now = new Date();

        if (now < slotStart) {
          return socket.emit("call-error", {
            message: "Call hasn't started yet.",
          });
        }

        if (now > slotEnd) {
          return socket.emit("call-error", {
            message: "Call window has expired.",
          });
        }

        // Join socket room
        socket.join(appointmentId);

        socket.emit("call-joined", {
          message: `Successfully joined the call as ${role}`,
          role,
        });

        io.to(appointmentId).emit("participant-joined", {
          userId,
          role,
        });
      } catch (error) {
        console.error("Join call error:", error);
        socket.emit("call-error", {
          message: "Server error. Please try again.",
        });
      }
    });

    socket.on("call-heartbeat", async ({ appointmentId }) => {
      await callState.addUser(appointmentId, userId); // update timestamp
    });

    socket.on("end-call", async ({ appointmentId }) => {
      await callState.markCallEnded(appointmentId);
      io.to(appointmentId).emit("call-ended", { appointmentId });
      io.in(appointmentId).socketsLeave(appointmentId);
      console.log(`Call ended for appointment ${appointmentId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  setInterval(async () => {
    const TIMEOUT = 15000;
    const now = Date.now();
    const calls = await callState.getAllActiveCalls();

    for (const appointmentId in calls) {
      const users = calls[appointmentId];
      for (const userId in users) {
        const lastActive = users[userId];
        if (now - lastActive > TIMEOUT) {
          console.log(`User ${userId} inactive in ${appointmentId}`);
          io.to(appointmentId).emit("force-disconnect", {
            userId,
            reason: "inactive",
          });
          await callState.removeUser(appointmentId, userId);
        }
      }
    }
  }, 15000);
};

async function socketEmittForTodayAppointment(socket, userId, role) {
  try {
    const appointments =
      role === "user"
        ? await appointmentService.getUserAppointmentsForToday(userId)
        : await appointmentService.getDoctorAppointmentsForToday(userId);

    const now = new Date();
    const nowIST = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);

    for (const appointment of appointments) {
      const [startTimeStr, endTimeStr] = appointment.timeSlot.split(" - ");
      const appointmentDate = new Date(appointment.appointmentDate);

      const [startHour, startMinute] = startTimeStr.split(":").map(Number);
      const [endHour, endMinute] = endTimeStr.split(":").map(Number);

      const slotStart = new Date(appointmentDate);
      slotStart.setUTCHours(startHour, startMinute, 0, 0);

      const slotEnd = new Date(appointmentDate);
      slotEnd.setUTCHours(endHour, endMinute, 0, 0);

      if (nowIST >= slotStart && nowIST <= slotEnd) {
        socket.emit("join-call", {
          appointmentId: appointment._id.toString(),
        });
      }
    }
  } catch (err) {
    console.error("🔴 Error in emitting today's appointment:", err);
  }
}

// // socket/callSocket.js
// const callState = require("./callStateManager");
// const appointmentService = require("../services/appointmentService");

// module.exports = function (io) {
//   io.on("connection", (socket) => {
//     const user = socket.user; // set via auth middleware
//     const userId = user.id;

//     console.log("Socket connected:", socket.id, "User ID:", userId);

//     // Check every 10 seconds
//     const intervalId = setInterval(() => {
//       socketEmittForUserTodayAppointment(socket, userId);
//     }, 5000);

//     socketEmittForUserTodayAppointment(socket, userId);

//     socket.on("join-call", async ({ appointmentId }) => {
//       try {
//         console.log(`${userId} joined appointment ${appointmentId}`);
//         const appointment = await appointmentService.isValidAppointment(
//           appointmentId,
//           userId
//         );

//         if (!appointment) {
//           return socket.emit("call-error", {
//             message: "Appointment not found.",
//           });
//         }

//         const appointmentDateStr = appointment.appointmentDate; // e.g., "2025-08-06T00:00:00.000+00:00"
//         const timeSlot = appointment.timeSlot; // e.g., "11:35 - 11:50"

//         // Parse appointment date and time slot
//         const [startTimeStr, endTimeStr] = timeSlot.split(" - "); // "11:35", "11:50"

//         const now = new Date(); // current server time (make sure to handle timezone if needed)
//         const appointmentDate = new Date(appointmentDateStr);

//         // Set actual start and end times on appointmentDate
//         const [startHour, startMinute] = startTimeStr.split(":").map(Number);
//         const [endHour, endMinute] = endTimeStr.split(":").map(Number);

//         const slotStart = new Date(appointmentDate);
//         slotStart.setUTCHours(startHour, startMinute, 0, 0);

//         const slotEnd = new Date(appointmentDate);
//         slotEnd.setUTCHours(endHour, endMinute, 0, 0);

//         if (now < slotStart) {
//           return socket.emit("call-error", {
//             message: "Call hasn't started yet.",
//           });
//         }

//         if (now > slotEnd) {
//           return socket.emit("call-error", {
//             message: "Call window has expired.",
//           });
//         }

//         // Proceed to join room if valid
//         socket.join(appointmentId);
//         socket.emit("call-joined", {
//           message: "Successfully joined the call.",
//         });
//       } catch (error) {
//         console.error("Join call error:", error);
//         socket.emit("call-error", {
//           message: "Server error. Please try again.",
//         });
//       }
//     });

//     socket.on("call-heartbeat", async ({ appointmentId }) => {
//       await callState.addUser(appointmentId, userId); // update timestamp
//     });

//     socket.on("end-call", async ({ appointmentId }) => {
//       await callState.markCallEnded(appointmentId);
//       io.to(appointmentId).emit("call-ended", { appointmentId });

//       // Remove all sockets from the room
//       io.in(appointmentId).socketsLeave(appointmentId);
//       console.log(`Call ended for appointment ${appointmentId}`);
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//       // Don't remove user yet – rejoin allowed unless call is ended
//     });
//   });

//   // Periodically check for inactive users and remove them
//   setInterval(async () => {
//     const TIMEOUT = 15000; // 15 seconds
//     const now = Date.now();
//     const calls = await callState.getAllActiveCalls();

//     for (const appointmentId in calls) {
//       const users = calls[appointmentId];
//       for (const userId in users) {
//         const lastActive = users[userId];
//         if (now - lastActive > TIMEOUT) {
//           console.log(`User ${userId} inactive in ${appointmentId}`);
//           io.to(appointmentId).emit("force-disconnect", {
//             userId,
//             reason: "inactive",
//           });
//           await callState.removeUser(appointmentId, userId);
//         }
//       }
//     }
//   }, 15000);
// };

// // ✅ FIXED: socket parameter added
// async function socketEmittForUserTodayAppointment(socket, userId) {
//   console.log("Checking appointments for user:", userId);
//   try {
//     const appointments = await appointmentService.getUserAppointmentsForToday(
//       userId
//     );

//     console.log("Appointments found:", appointments.length);

//     const now = new Date();
//     const nowIST = new Date(now.getTime() + 5.5 * 60 * 60 * 1000); // Add 5.5 hours

//     for (const appointment of appointments) {
//       const [startTimeStr, endTimeStr] = appointment.timeSlot.split(" - ");
//       const appointmentDate = new Date(appointment.appointmentDate);

//       const [startHour, startMinute] = startTimeStr.split(":").map(Number);
//       const [endHour, endMinute] = endTimeStr.split(":").map(Number);

//       const slotStart = new Date(appointmentDate);
//       slotStart.setUTCHours(startHour, startMinute, 0, 0);

//       const slotEnd = new Date(appointmentDate);
//       slotEnd.setUTCHours(endHour, endMinute, 0, 0);

//       console.log("now time", nowIST);
//       console.log("slotStart time", slotStart);
//       console.log("slotEnd time", slotEnd);
//       if (nowIST >= slotStart && nowIST <= slotEnd) {
//         console.log("Enabling join button for appointment:", appointment._id);
//         socket.emit("join-call", {
//           appointmentId: appointment._id.toString(),
//         });
//       }
//       else {
//         console.log("condition is false.");
//       }
//     }
//   } catch (error) {
//     console.error(
//       "❌ Error while checking appointments on socket connect:",
//       error
//     );
//   }
// }
