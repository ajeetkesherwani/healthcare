const Redis = require('ioredis');

const redis = new Redis('redis://default:pUcSkOksEU0oN3L48UObLCNDOvmHxCGt@redis-10112.crce182.ap-south-1-1.ec2.redns.redis-cloud.com:10112');

redis.ping()
  .then((res) => {
    console.log('✅ Redis connected successfully:', res); // Expect "PONG"
    redis.quit();
  })
  .catch((err) => {
    console.error('❌ Redis connection failed:', err);
  });
