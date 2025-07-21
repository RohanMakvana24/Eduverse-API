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
import {cloudinary} from "./config/cloudinary/cloudinary.js";
import VerificationEmailWorker from "./worker/VerificationEmailWorker.js";


// ~ Database Configuration
connectDB();

// ~ Cloudinary Configuration
cloudinary.api.ping().then(() => console.log("Cloudinary is connected")).catch((err) => console.log(err));

// ~ Server Setup
const app = express();

// ~ Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// ~ Routes
const v1AuthPath = "/api/v1/auth";
const v2AuthPath = "/api/v2/auth";

app.use(v1AuthPath, v1AuthRouter);
app.use(v2AuthPath, v2AuthRouter);

export default app;
