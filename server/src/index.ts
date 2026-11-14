import express from "express";
import cors from "cors";
import helmet from "helmet";
import { execSync } from "child_process";
import { env } from "./config/env.js";
import { prisma } from "./config/prisma.js";
import { apiLimiter } from "./middleware/rateLimiter.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import runRoutes from "./routes/runRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import settingsRoutes from "./routes/settingsRoutes.js";
import yoyoRoutes from "./routes/yoyoRoutes.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true);
      // Allow localhost, vercel deployments, or configured client url
      if (
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        origin.endsWith(".vercel.app") ||
        origin === "https://fittrack-pied-five.vercel.app" ||
        origin === env.CLIENT_URL
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

// Rate limiter for API
app.use("/api", apiLimiter);

// Health check endpoint (available both at /api/health and /health)
const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({
    status: "ok",
    app: "FITTRACK API",
    tagline: "Train Smarter. Run Stronger.",
    endpoints: {
      auth: "/api/auth (and /auth)",
      health: "/api/health"
    },
    timestamp: new Date().toISOString()
  });
};
app.get("/api/health", healthHandler);
app.get("/health", healthHandler);

// Remote database sync endpoint for automated initialization
const dbSyncHandler = async (_req: express.Request, res: express.Response) => {
  try {
    console.log("Triggering on-demand prisma db push...");
    const output = execSync("npx prisma db push --accept-data-loss").toString();
    res.json({
      success: true,
      message: "FitTrack PostgreSQL schema pushed successfully.",
      output
    });
  } catch (err: any) {
    console.error("On-demand db push error:", err);
    res.status(500).json({
      success: false,
      message: "Database push failed",
      error: err.message,
      stderr: err.stderr?.toString()
    });
  }
};
app.all("/api/db-sync", dbSyncHandler);
app.all("/db-sync", dbSyncHandler);

// API Routes - Dual-mounted for /api/* and root /* to eliminate any route mismatch
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/profile", profileRoutes);
app.use("/profile", profileRoutes);

app.use("/api/exercises", exerciseRoutes);
app.use("/exercises", exerciseRoutes);

app.use("/api/workouts", workoutRoutes);
app.use("/workouts", workoutRoutes);

app.use("/api/runs", runRoutes);
app.use("/runs", runRoutes);

app.use("/api/progress", progressRoutes);
app.use("/progress", progressRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/dashboard", dashboardRoutes);

app.use("/api/settings", settingsRoutes);
app.use("/settings", settingsRoutes);

app.use("/api/yoyo-tests", yoyoRoutes);
app.use("/yoyo-tests", yoyoRoutes);

// JSON 404 Catch-All Handler (ensures all unhandled endpoints return structured JSON, never HTML)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}. Route not registered on FitTrack API.`
  });
});

// Error Handling Middleware
app.use(errorHandler);

// Helper to verify and ensure database tables exist on server startup
async function verifyDatabaseTables() {
  try {
    await prisma.user.findFirst({ take: 1 });
    console.log("✅ FitTrack PostgreSQL database tables verified and accessible.");
  } catch (err: any) {
    console.warn("⚠️ FitTrack Database table missing. Running automated prisma db push...", err.message);
    try {
      execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
      console.log("✅ FitTrack Prisma db push successfully completed on startup.");
    } catch (syncErr: any) {
      console.error("❌ FitTrack startup db push failed:", syncErr.message);
    }
  }
}

// Start server
const server = app.listen(env.PORT, async () => {
  console.log(`🚀 FITTRACK Server running on http://localhost:${env.PORT}`);
  console.log(`⚡ Environment: ${env.NODE_ENV}`);
  await verifyDatabaseTables();
});

export default app;
