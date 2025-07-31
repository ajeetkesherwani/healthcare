// socket/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("Unauthorized"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { userId, role }
      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });
};
