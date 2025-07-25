import dotenv from "dotenv";
// ~ Load environment variables from .env file
dotenv.config();
import express from "express";
import connectDB from "./config/database/Dbconnect.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import v1AuthRouter from "./routes/v1/Auth.Routes.js";
import v2AuthRouter from "./routes/v2/Auth.Routes.js";
import V1UserRoutes from "./routes/v1/User.Route.js";
import { cloudinary } from "./config/cloudinary/cloudinary.js";
import VerificationEmailWorker from "./worker/VerificationEmailWorker.js";
import resetPasswordEmailWorker from "./worker/ResetPasswordEmailWorker.js";

// ~ Database Configuration
connectDB();

// ~ Cloudinary Configuration
cloudinary.api
  .ping()
  .then(() => console.log("Cloudinary is connected"))
  .catch((err) => console.log(err));

// ~ Server Setup
const app = express();

// ~ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// ~ Routes
const v1AuthPath = "/api/v1/auth";
const v2AuthPath = "/api/v2/auth";
const v1UserPath = "/api/v1/user";

// Auth Routes 🎯
app.use(v1AuthPath, v1AuthRouter);
app.use(v2AuthPath, v2AuthRouter);
// User Routes 🎯
app.use(v1UserPath, V1UserRoutes);

export default app;
