const { Queue } = require("bullmq");
const { redisConnection } = require("../config/redis.config");

const bookingQueue = new Queue("bookingQueue", {
  connection: redisConnection,
});

module.exports = bookingQueue;
