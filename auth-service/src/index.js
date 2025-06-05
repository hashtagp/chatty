import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.AUTH_SERVICE_PORT || 3001;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    service: "Auth Service", 
    status: "healthy", 
    timestamp: new Date().toISOString() 
  });
});

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Auth Service is running on PORT: ${PORT}`);
  connectDB();
});
