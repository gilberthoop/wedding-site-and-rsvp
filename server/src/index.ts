import dotenv from "dotenv";
import path from "path";

// ── Environment — must run before any module reads process.env ────────────
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";

import notificationRoutes from "./routes/notifications";
import rsvpRoutes from "./routes/rsvp";
import guestRoutes from "./routes/guests";
import { errorHandler } from "./middleware/errorHandler";

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not set. Add it to your .env file (see .env.example).",
  );
}

// ── App ───────────────────────────────────────────────
const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_ORIGIN || "https://yourdomain.com"
        : "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ────────────────────────────────────────────
app.use("/api/notifications", notificationRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/guests", guestRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Central error handler (must be last middleware)
app.use(errorHandler);

// ── Database & Server Start ───────────────────────────
async function startServer(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI as string, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });

    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🌸 Wedding API server running on http://localhost:${PORT}`);
      console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received — shutting down gracefully");
  await mongoose.connection.close();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  console.log("SIGTERM received — shutting down gracefully");
  await mongoose.connection.close();
  process.exit(0);
});

startServer();

export default app;
