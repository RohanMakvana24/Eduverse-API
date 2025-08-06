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
  deleteCourse,
  getAllCourse,
  getSingleCourse,
  updateCourse,
} from "../../controller/v1/V1CourseController.js";

export const V1CourseRouter = Router();

// 🚦  Course API Route 🚦

/* `` Create a new course route ``  */
V1CourseRouter.post(
  "/create",
  upload.single("file"),
  isAuthenticated,
  authorizeRole("instructor"),
  ValdiateReq(CreateCourseValidate, { requireFile: true }),
  createCourse
);

/* `` Get All Course Route ``  */
V1CourseRouter.get("/courses", getAllCourse);

/* `` Get Single Course Route  ``  */
V1CourseRouter.get("/:courseId", getSingleCourse);

/* `` Update Course Route  ``  */
V1CourseRouter.put(
  "/:courseId",
  upload.single("file"),
  isAuthenticated,
  authorizeRole("instructor"),
  ValdiateReq(UpdateCourseValidation, { optionalFile: true }),
  updateCourse
);

/* `` Delete Course Course  ``  */
V1CourseRouter.delete(
  "/:courseId",
  isAuthenticated,
  authorizeRole("instructor"),
  deleteCourse
);

export default V1CourseRouter;
