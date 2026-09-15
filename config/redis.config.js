require("dotenv").config();
const redis = require("redis");

const redisUrl = process.env.REDIS_URL || process.env.REDIS_HOST;

const redisClient = redis.createClient({
  url: redisUrl,
});

const redisConnection = (() => {
  const url = new URL(redisUrl);

  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
  };
})();

let connectPromise;

redisClient.on("connect", () => {
  console.log("redis connected");
});

redisClient.on("error", (err) => {
  console.log("error : ", err);
});

const connectRedis = async () => {
  if (redisClient.isOpen) {
    return redisClient;
  }

  if (!connectPromise) {
    connectPromise = redisClient.connect().catch((err) => {
      connectPromise = undefined;
      throw err;
    });
  }

  await connectPromise;
  return redisClient;
};

module.exports = { redisClient, connectRedis, redisConnection };
