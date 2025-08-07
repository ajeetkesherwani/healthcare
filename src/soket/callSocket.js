// socket/callSocket.js
const callState = require("./callStateManager");
const appointmentService = require("../services/appointmentService");

module.exports = function (io) {
  io.on("connection", (socket) => {
    const user = socket.user; // set via auth middleware
    console.log("user", user);
    const userId = user.id;

    console.log("Socket connected:", socket.id, "User ID:", userId);

    socket.on("join-call", async ({ appointmentId }) => {
      try {
        console.log(`${userId} joined appointment ${appointmentId}`);
        const appoitment = await appointmentService.isValidAppointment(
          appointmentId,
          userId
        );

        if (!appointment) {
          return socket.emit("call-error", {
            message: "Appointment not found.",
          });
        }

        const appointmentDateStr = appointment.appointmentDate; // e.g., "2025-08-06T00:00:00.000+00:00"
        const timeSlot = appointment.timeSlot; // e.g., "11:35 - 11:50"

        // Parse appointment date and time slot
        const [startTimeStr, endTimeStr] = timeSlot.split(" - "); // "11:35", "11:50"

        const now = new Date(); // current server time (make sure to handle timezone if needed)
        const appointmentDate = new Date(appointmentDateStr);

        // Set actual start and end times on appointmentDate
        const [startHour, startMinute] = startTimeStr.split(":").map(Number);
        const [endHour, endMinute] = endTimeStr.split(":").map(Number);

        const slotStart = new Date(appointmentDate);
        slotStart.setUTCHours(startHour, startMinute, 0, 0);

        const slotEnd = new Date(appointmentDate);
        slotEnd.setUTCHours(endHour, endMinute, 0, 0);

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

        // Proceed to join room if valid
        socket.join(appointmentId);
        socket.emit("call-joined", {
          message: "Successfully joined the call.",
        });
      } catch (error) {
        console.error("Join call error:", error);
        socket.emit("call-error", {
          message: "Server error. Please try again.",
        });
      }
      // const isEnded = await callState.isCallEnded(appointmentId);

      // if (!isValid || isEnded) {
      //   socket.emit("join-denied", {
      //     reason: isEnded ? "call-ended" : "unauthorized",
      //   });
      //   return;
      // }

      // await callState.addUser(appointmentId, userId); // track in Redis
      // socket.join(appointmentId);

      // console.log(`${userId} joined appointment ${appointmentId}`);
      // io.to(appointmentId).emit("user-joined", { userId });
    });

    socket.on("call-heartbeat", async ({ appointmentId }) => {
      await callState.addUser(appointmentId, userId); // update timestamp
    });

    socket.on("end-call", async ({ appointmentId }) => {
      await callState.markCallEnded(appointmentId);
      io.to(appointmentId).emit("call-ended", { appointmentId });

      // Remove all sockets from the room
      io.in(appointmentId).socketsLeave(appointmentId);
      console.log(`Call ended for appointment ${appointmentId}`);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
      // Don't remove user yet – rejoin allowed unless call is ended
    });
  });

  // Periodically check for inactive users and remove them
  setInterval(async () => {
    const TIMEOUT = 15000; // 15 seconds
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

// // socket/callSocket.js
// const activeCallUsers = {}; // In-memory tracking

// module.exports = function (io) {
//   io.on("connection", (socket) => {
//     console.log("Socket connected:", socket.id);

//     socket.on("join-call", ({ appointmentId, userId }) => {
//       socket.join(appointmentId);
//       if (!activeCallUsers[appointmentId]) {
//         activeCallUsers[appointmentId] = {};
//       }
//       activeCallUsers[appointmentId][userId] = Date.now();
//       console.log(`${userId} joined appointment ${appointmentId}`);
//     });

//     socket.on("call-heartbeat", ({ appointmentId, userId }) => {
//       if (activeCallUsers[appointmentId]) {
//         activeCallUsers[appointmentId][userId] = Date.now();
//       }
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected:", socket.id);
//       // Optional: cleanup logic if needed
//     });
//   });

//   // Check for inactive users every 15 seconds
//   setInterval(() => {
//     const now = Date.now();
//     const TIMEOUT = 15000; // 15 seconds

//     for (const appointmentId in activeCallUsers) {
//       for (const userId in activeCallUsers[appointmentId]) {
//         const lastActive = activeCallUsers[appointmentId][userId];
//         if (now - lastActive > TIMEOUT) {
//           console.log(`User ${userId} is inactive in ${appointmentId}`);

//           // Emit force-disconnect to this user
//           io.to(appointmentId).emit("force-disconnect", {
//             userId,
//             reason: "inactive",
//           });

//           // Remove the user from active list
//           delete activeCallUsers[appointmentId][userId];
//         }
//       }
//     }
//   }, 15000); // check every 15 seconds
// };
