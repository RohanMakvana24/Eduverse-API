import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth/Authenticated.js";
import { ValdiateReq } from "../../middleware/validation/ValidateReq.js";
import authorizeRole from "../../middleware/auth/Authorize.js";
import upload from "../../middleware/upload/Multer.js";
import {
  CreateChapterSchema,
  CreateCourseValidate,
  CreateSectionValidation,
  UpdateCourseSection,
  UpdateCourseValidation,
} from "../../validation/course/CourseValidationSchema.js";
import {
  createChapter,
  createCourse,
  CreateSectionController,
  deleteCourse,
  deleteSection,
  getAllCourse,
  GetAllCourseSection,
  GetSection,
  getSingleCourse,
  updateCourse,
  UpdateSection,
} from "../../controller/v1/V1CourseController.js";

export const V1CourseRouter = Router();

//~~~~~~~~~~~~~~~~🚦  Course API Route 🚦~~~~~~~~~~~~~~~~~~~~~~~~~~~//

/* `` Create a new course ``  */
V1CourseRouter.post(
  "/create",
  upload.single("file"),
  isAuthenticated,
  authorizeRole("instructor"),
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
  isAuthenticated,
  authorizeRole("instructor"),
  ValdiateReq(UpdateCourseValidation, { optionalFile: true }),
  updateCourse
);

/* ` Delete Course Route ``  */
V1CourseRouter.delete(
  "/:courseId",
  isAuthenticated,
  authorizeRole("instructor"),
  deleteCourse
);

// ~~~~~~~~~~~~~~~~🚦  Section API Route 🚦~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/* Create Section Route */
V1CourseRouter.post(
  "/:courseId/sections",
  upload.none(),
  isAuthenticated,
  authorizeRole("instructor"),
  ValdiateReq(CreateSectionValidation),
  CreateSectionController
);

/* Get All Section By Course Route */
V1CourseRouter.get("/:courseId/sections", isAuthenticated, GetAllCourseSection);

/* Get a specific section Route */
V1CourseRouter.get(
  "/:courseId/sections/:sectionId",
  isAuthenticated,
  GetSection
);

/* Update section title/description Route */
V1CourseRouter.put(
  "/:courseId/sections/:sectionId",
  upload.none(),
  isAuthenticated,
  authorizeRole("instructor"),
  ValdiateReq(UpdateCourseSection),
  UpdateSection
);

/* Delete a section Route */
V1CourseRouter.delete(
  "/:courseId/sections/:sectionId",
  upload.none(),
  isAuthenticated,
  authorizeRole("instructor"),
  deleteSection
);

// ~~~~~~~~~~~~~~~~🚦  Chapters API Route 🚦~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
V1CourseRouter.post(
  "/:courseId/sections/:sectionId/chapters",
  upload.none(),
  isAuthenticated,
  authorizeRole("instructor"),
  ValdiateReq(CreateChapterSchema),
  createChapter
);
export default V1CourseRouter;
