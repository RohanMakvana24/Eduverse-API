import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth/Authenticated.js";
import { ValdiateReq } from "../../middleware/validation/ValidateReq.js";
import authorizeRole from "../../middleware/auth/Authorize.js";
import upload from "../../middleware/upload/Multer.js";
import { CreateCourseValidate } from "../../validation/course/CourseValidationSchema.js";
export const V1CourseRouter = Router();

// 🚦  Course API Route 🚦

/* `` Create a new course ``  */
V1CourseRouter.post(
  "/create",
  upload.single("thumbnail"),
  isAuthenticated,
  ValdiateReq(CreateCourseValidate)
);

export default V1CourseRouter;
