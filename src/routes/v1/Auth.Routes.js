import {Router} from "express";
import upload from "../../middleware/upload/Multer.js";
import {ValdiateReq} from "../../middleware/validation/ValidateReq.js";
import {EmailVerificationValidation, SignupValidation} from "../../validation/auth/authValidation.js";
import {EmailVerification, Signup} from "../../controller/v1/V1AuthController.js";

const v1AuthRouter = Router();

// 🚦 Register Route 🚦
v1AuthRouter.post("/signup", upload.single("file"), ValdiateReq(SignupValidation, {requireFile: true}), Signup)

// 🚦 Email Verification Route 🚦
v1AuthRouter.post("/verify-email", upload.none(), ValdiateReq(EmailVerificationValidation), EmailVerification)

export default v1AuthRouter;
