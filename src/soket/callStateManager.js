const redis = require("../utils/redisClient");

// Test Redis connection using your utility client
redis.ping().then((res) => {
  console.log("✅ Redis ping response:", res); // Should log 'PONG'
}).catch((err) => {
  console.error("❌ Redis ping failed:", err);
});

module.exports = {
  async addUser(appointmentId, userId) {
    const key = `call:${appointmentId}`;
    await redis.hset(key, userId, Date.now());
  },

  async removeUser(appointmentId, userId) {
    const key = `call:${appointmentId}`;
    await redis.hdel(key, userId);
  },

  async getAllActiveCalls() {
    const keys = await redis.keys("call:*");
    const result = {};
    for (const key of keys) {
      const appointmentId = key.split(":")[1];
      const users = await redis.hgetall(key);
      result[appointmentId] = Object.fromEntries(
        Object.entries(users).map(([uid, ts]) => [uid, parseInt(ts)])
      );
    }
    return result;
  },

  async markCallEnded(appointmentId) {
    await redis.set(`call-ended:${appointmentId}`, "true");
  },

  async isCallEnded(appointmentId) {
    const value = await redis.get(`call-ended:${appointmentId}`);
    return value === "true";
  },
};