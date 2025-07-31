import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import v1AuthRouter from "./routes/v1/Auth.Routes.js";
import v2AuthRouter from "./routes/v2/Auth.Routes.js";
import V1UserRouter from "./routes/v1/User.Route.js";
import VerificationEmailWorker from "./worker/VerificationEmailWorker.js";
import resetPasswordEmailWorker from "./worker/resetPasswordEmailWorker.js";
import V1CourseRouter from "./routes/v1/Course.Route.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", v1AuthRouter);
app.use("/api/v2/auth", v2AuthRouter);
app.use("/api/v1/user", V1UserRouter);
app.use("/api/v1/course", V1CourseRouter);

// Global error handler — always returns JSON
app.use((err, req, res, next) => {
  console.error("🔥 Global Error Handler:", err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: typeof err === "object" ? JSON.stringify(err) : err,
  });
});

export default app;
