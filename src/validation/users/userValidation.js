import Joi from "joi";

// ~ Update User Profile Schema
export const UpdateUserProfileSchema = Joi.object({
  fullname: Joi.string().trim().min(3).max(50).messages({
    "string.base": "Full name must be a string.",
    "string.min": "Full name must be at least 3 characters long.",
    "string.max": "Full name must be at most 50 characters long.",
  }),

  email: Joi.string()
    .email({ tlds: { allow: false } }) // disables top-level domain check
    .messages({
      "string.email": "Please enter a valid email address.",
    }),
});

// ~ Change Psssword  Schema
export const ChangePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;'<>,.?/]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    }),

  newPassword: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;'<>,.?/]).{8,}$"
      )
    )
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
    }),
});
