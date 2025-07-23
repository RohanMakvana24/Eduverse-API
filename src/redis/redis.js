import redis from "redis";

const redisClient = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

// Error handler
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

// Successful connection
redisClient.on("connect", () => {
  console.log("Redis Connected Successfully");
});

await redisClient.connect(); // 🔥 Must connect before using

export default redisClient;
