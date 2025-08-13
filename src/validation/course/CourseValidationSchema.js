import Joi from "joi";
import mongoose, { mongo } from "mongoose";
// Helper Object Id Validation
const ObjectId = Joi.string().custom((value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid - Invalid ObjectId");
  }
  return value;
}, "ObjectId Validation");

// // 🧠 Topics Schema
// const topicSchema = Joi.object({
//   title: Joi.string().required(),
//   duration: Joi.number().min(0).required(),
//   locked: Joi.boolean().default(true),
// });

// // 📚 Material Schema
// const materialSchema = Joi.object({
//   title: Joi.string().required(),
// });
// // Chapter Schema
// const chapterSchema = Joi.object({
//   title: Joi.string().required(),
//   description: Joi.string().allow("").optional(),
//   topics: Joi.array().items(topicSchema).min(1).required(),
// });
// // Sections Schema
// const sectionSchema = Joi.object({
//   title: Joi.string().required(),
//   description: Joi.string().allow("").optional(),
//   chapters: Joi.array().items(chapterSchema).min(1).required(),
//   materials: Joi.array().items(materialSchema).optional(),
// });
// export const CreateCourseValidation = Joi.object({
//   title: Joi.string().required().trim().messages({
//     "string.empty": "Title is required",
//     "any.required": "Title is required",
//   }),
//   slug: Joi.string().required().trim().messages({
//     "string.empty": "Slug is required",
//     "any.required": "Slug is required",
//   }),
//   description: Joi.string().required().trim().messages({
//     "string.empty": "Description is required",
//     "any.required": "Description is required",
//   }),
//   price: Joi.number().required().messages({
//     "number.base": "Price must be a number",
//     "any.required": "Price is required",
//   }),
//   isFree: Joi.boolean().default(false).messages({
//     "boolean.base": "isFree must be a boolean",
//   }),
//   published: Joi.boolean().default(false),
//   instructor: ObjectId.required(),
//   sections: Joi.array().items(sectionSchema).required().messages({
//     "array.base": "Sections must be an array",
//   }),
// });

/* `` Create Course Validation `` */
export const CreateCourseValidate = Joi.object({
  title: Joi.string().required().trim().messages({
    "string.empty": "title is required",
    "string.any": "Title is required",
  }),
  slug: Joi.string().trim().required().messages({
    "string.empty": "Course Slug is required",
    "string.any": "Course Slug is required",
  }),
  description: Joi.string().required().trim().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  price: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),
  isFree: Joi.boolean().default(false).messages({
    "boolean.base": "isFree must be a boolean",
  }),
  published: Joi.boolean().default(false),
  instructor: ObjectId.required(),
});

/* `` Update Course Validation `` */
export const UpdateCourseValidation = Joi.object({
  title: Joi.string().required().trim().messages({
    "string.empty": "title is required",
    "string.any": "Title is required",
  }),
  description: Joi.string().required().trim().messages({
    "string.empty": "Description is required",
    "any.required": "Description is required",
  }),
  price: Joi.number().required().messages({
    "number.base": "Price must be a number",
    "any.required": "Price is required",
  }),
  isFree: Joi.boolean().default(false).messages({
    "boolean.base": "isFree must be a boolean",
  }),
});

/* `` Create Course Section Validation `` */
export const CreateSectionValidation = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.base": "Title must be a string",
  }),
  description: Joi.string().allow("").optional(),
});

/* `` Update Course Section Validation `` */
export const UpdateCourseSection = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.base": "Title must be a string",
  }),
  description: Joi.string().allow("").optional(),
});

/* `` Update Course Section Validation `` */
export const CreateChapterSchema = Joi.object({
  title: Joi.string().required().messages({
    "any.required": "Title is required",
    "string.base": "Title must be a string",
  }),
  description: Joi.string().allow("").optional(),
});
