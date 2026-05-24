import express from 'express';
import dotenv from 'dotenv';
import songRoutes from './route/route.js';
import { redisClient } from './config/redis.js';
import cors from 'cors';


dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost",
    credentials: true,
  })
);

redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch(console.error);


app.use("/api/songs", songRoutes);
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});


const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Song service is running on port ${PORT}`);
});