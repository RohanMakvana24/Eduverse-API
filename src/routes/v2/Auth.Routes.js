import {Router} from "express";
import upload from "../../middleware/upload/Multer.js";
import {ValdiateReq} from "../../middleware/validation/ValidateReq.js";
import {SignupValidation} from "../../validation/auth/authValidation.js";
import {EmailVerification, Signup} from "../../controller/v1/V1AuthController.js";
import {EmailVerificationValidation} from "../../validation/auth/authValidation.js";
const v2AuthRouter = Router();

// Signup Routes

// 🚦 Register Route 🚦
v2AuthRouter.post("/signup", upload.single("file"), ValdiateReq(SignupValidation), Signup)

// 🚦 Email Verification Route 🚦
v2AuthRouter.post("/verify-email", upload.none(), ValdiateReq(EmailVerificationValidation), EmailVerification)


export default v2AuthRouter;
