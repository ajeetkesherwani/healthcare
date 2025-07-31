const Redis = require("ioredis");
// const redis = new Redis(process.env.REDIS_URL);

const redis = new Redis({
  host: 'redis-10112.crce182.ap-south-1-1.ec2.redns.redis-cloud.com',
  port: 10112,
  username: 'default',
  password: 'pUcSkOksEU0oN3L48UObLCNDOvmHxCGt',
});
module.exports = redis;
