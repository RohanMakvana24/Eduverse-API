import { Router } from "express";
import upload from "../../middleware/upload/Multer.js";
import { ValdiateReq } from "../../middleware/validation/ValidateReq.js";
import {
  EmailVerificationValidation,
  ForgotPasswordValidation,
  LoginValidation,
  RefreshTokenValidation,
  ResendEmailOTPValidation,
  ResetPasswordValidation,
  SignupValidation,
} from "../../validation/auth/authValidation.js";
import {
  EmailVerification,
  login,
  Signup,
  ResendEmailOTP,
  RefreshToken,
  logout,
  ForgotPassword,
  ResetPassword,
  getUser,
} from "../../controller/v1/V1AuthController.js";
import { isAuthenticated } from "../../middleware/auth/Authenticated.js";
import { v1 } from "uuid";

const v1AuthRouter = Router();

// 🚦 Register Route 🚦
v1AuthRouter.post(
  "/signup",
  upload.single("file"),
  ValdiateReq(SignupValidation, { requireFile: true }),
  Signup
);

// 🚦 Email Verification Route 🚦
v1AuthRouter.post(
  "/verify-email",
  upload.none(),
  ValdiateReq(EmailVerificationValidation),
  EmailVerification
);

// 🚦 Resend Verification Email OTP 🚦
v1AuthRouter.post("/resend-email-otp", upload.none(), ResendEmailOTP);

// 🚦 Login Route 🚦
v1AuthRouter.post("/login", upload.none(), ValdiateReq(LoginValidation), login);

// 🚦 Refreshtoken through accesstoken generates 🚦
v1AuthRouter.post(
  "/refresh-token",
  upload.none(),
  ValdiateReq(RefreshTokenValidation),
  RefreshToken
);

// 🚦 Logout Route 🚦
v1AuthRouter.post(
  "/logout",
  upload.none(),
  isAuthenticated,
  ValdiateReq(RefreshTokenValidation),
  logout
);

// 🚦 Forgot Password Route 🚦
v1AuthRouter.post(
  "/forgot-password",
  upload.none(),
  ValdiateReq(ForgotPasswordValidation),
  ForgotPassword
);

// 🚦 Reset Password Route 🚦
v1AuthRouter.post(
  "/resetPassword/:token",
  upload.none(),
  ValdiateReq(ResetPasswordValidation),
  ResetPassword
);

// 🚦 Get Current User Route 🚦
v1AuthRouter.get("/me", isAuthenticated, getUser);
export default v1AuthRouter;
