import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth/Authenticated.js";
import { ValdiateReq } from "../../middleware/validation/ValidateReq.js";
import authorizeRole from "../../middleware/auth/Authorize.js";
import upload from "../../middleware/upload/Multer.js";
import {
  CreateCourseValidate,
  UpdateCourseValidation,
} from "../../validation/course/CourseValidationSchema.js";
import {
  createCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
} from "../../controller/v1/V1CourseController.js";

export const V1CourseRouter = Router();

// 🚦  Course API Route 🚦

/* `` Create a new course ``  */
V1CourseRouter.post(
  "/create",
  upload.single("file"),
  isAuthenticated,
  ValdiateReq(CreateCourseValidate, { requireFile: true }),
  createCourse
);

/* `` Get All Course  ``  */
V1CourseRouter.get("/courses", getAllCourse);

/* `` Get Single Course  ``  */
V1CourseRouter.get("/:courseId", getSingleCourse);

/* ` Update Course  ``  */
V1CourseRouter.put(
  "/:courseId",
  upload.single("file"),
  ValdiateReq(UpdateCourseValidation, { optionalFile: true }),
  updateCourse
);
export default V1CourseRouter;
