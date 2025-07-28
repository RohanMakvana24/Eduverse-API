import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth/Authenticated.js";
import {
  ChangePassword,
  GetUserProfile,
  logoutFromSession,
  UpdateUserProfile,
} from "../../controller/v1/V1UserController.js";
import upload from "../../middleware/upload/Multer.js";
import { ValdiateReq } from "../../middleware/validation/ValidateReq.js";
import {
  ChangePasswordSchema,
  UpdateUserProfileSchema,
} from "../../validation/users/userValidation.js";

const V1UserRoutes = Router();

// 🚦 View profile Route 🚦
V1UserRoutes.get("/profile", isAuthenticated, GetUserProfile);
// 🚦 Update profile info Route 🚦
V1UserRoutes.put(
  "/profile",
  upload.single("file"),
  ValdiateReq(UpdateUserProfileSchema, { requireFile: true }),
  isAuthenticated,
  UpdateUserProfile
);
// 🚦 Change password Route 🚦
V1UserRoutes.put(
  "/change-password",
  isAuthenticated,
  ValdiateReq(ChangePasswordSchema),
  ChangePassword
);
// 🚦 View active login sessions Route 🚦
V1UserRoutes.get("/sessions", isAuthenticated);
// 🚦 Logout from specific device Route 🚦
V1UserRoutes.delete("/sessions/:sessionId", isAuthenticated, logoutFromSession);
export default V1UserRoutes;
