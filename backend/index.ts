import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors({
  origin: 'https://launchpad-kappa-nine.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get("/", (_req, res) => {
  res.status(200).send("Launchpad Backend is Live!");
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", projectRoutes);

// 404 handler
app.use((_req, res) => {
  console.log("404: Route not found");
  res.status(404).json({ msg: "Route not found" });
});

async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(MONGO_URI);
    
    // Explicitly binding to '0.0.0.0' is the key fix here
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
