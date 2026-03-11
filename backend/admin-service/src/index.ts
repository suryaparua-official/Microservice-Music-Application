import express from "express";
import dotenv from "dotenv";
import { initDB } from "./database/initDB.js";
import adminRoutes from "./route/route.js";
import connectCloudinary from "./config/cloudinary.js";
import { redisClient } from "./config/redis.js";
import cors from "cors";

dotenv.config();
connectCloudinary();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch(console.error);

app.use("/api/admin", adminRoutes);
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const PORT = process.env.PORT;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Admin service is running on port ${PORT}`);
    });
  })
  .catch(() => {
    process.exit(1);
  });
