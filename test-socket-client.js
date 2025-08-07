// test-socket-client.js
const { io } = require("socket.io-client");

const socket = io("http://192.168.1.14:5002", {
  auth: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzhmNWIxZDQxMzJiNWRiYWQ3NzUyYyIsImlhdCI6MTc1NDAzNzM4MX0.LzaeoVG-eRiaEXevRToOcfisar99Yj4s2kJA4QqopJg",
  },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("✅ Socket connected!", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("❌ Connection error:", err.message);
});

socket.on("disconnect", (reason) => {
  console.warn("⚠️ Socket disconnected:", reason);
});
