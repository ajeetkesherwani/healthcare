// socket/callSocket.js
const callState = require("./callStateManager");
const appointmentService = require("../services/appointmentService");

module.exports = function (io) {
  io.on("connection", (socket) => {
    const user = socket.user; // set via auth middleware
    const userId = user.userId;

    console.log("Socket connected:", socket.id, "User ID:", userId);

    socket.on("join-call", async ({ appointmentId }) => {
      const isValid = await appointmentService.isValidAppointment(appointmentId, userId);
      const isEnded = await callState.isCallEnded(appointmentId);

      if (!isValid || isEnded) {
        socket.emit("join-denied", { reason: isEnded ? "call-ended" : "unauthorized" });
        return;
      }

      await callState.addUser(appointmentId, userId); // track in Redis
      socket.join(appointmentId);

      console.log(`${userId} joined appointment ${appointmentId}`);
      io.to(appointmentId).emit("user-joined", { userId });
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


