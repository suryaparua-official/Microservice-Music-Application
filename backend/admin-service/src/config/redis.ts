import { createClient } from "redis";

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    tls: false,
  },
  ...(process.env.REDIS_PASSWORD
    ? { password: process.env.REDIS_PASSWORD }
    : {}),
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

export { redisClient };
