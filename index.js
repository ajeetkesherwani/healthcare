process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./src/app");
const callRoutes = require("./src/routes/user/callRoutes"); // ✅ Adjust path if needed
const setupCallSocket = require("./src/soket/callSocket"); // ✅ new import
const authMiddleware = require("./src/soket/authMiddleware"); // ✅ new import

dotenv.config({ path: "config.env" });
console.log("REDIS_URL from env:", process.env.REDIS_URL);
const httpServer = http.createServer(app);
const Redis = require('ioredis');
const testRedis = new Redis(process.env.REDIS_URL);

testRedis.ping()
  .then(res => console.log("Redis ping from app:", res))
  .catch(err => console.error("Redis ping failed in app:", err));


// ✅ Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
  pingTimeout: 60000,
});

app.locals.io = io;
console.log("Redis URL:", process.env.REDIS_URL);
// ✅ Attach call management socket logic
authMiddleware(io);
setupCallSocket(io);

app.use("/api", callRoutes);

// (Optional) Keep your live-feed demo route
app.get("/api/live-feed", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendData = () => {
    const data = {
      timestamp: new Date().toISOString(),
      message: "Live update from server",
      random: Math.floor(Math.random() * 1000),
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const intervalId = setInterval(sendData, 5000);

  req.on("close", () => {
    clearInterval(intervalId);
    res.end();
  });
});

// ✅ DB connection
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connection established."))
  .catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 7001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  console.log(err.stack);
  httpServer.close(() => {
    process.exit(1);
  });
});
