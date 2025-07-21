import Joi from "joi";

/* ♣ Signup Validation ♣ */
export const SignupValidation = Joi.object({
    fullname: Joi.string().required().messages(
        {"string.empty": "Fullname is required", "any.required": "Fullname is required"}
    ),

    email: Joi.string().email().required().messages(
        {"string.empty": "Email is required", "string.email": "Invalid email address", "any.required": "Email is required"}
    ),

    password: Joi.string().pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}:;'<>,.?/]).{8,}$")).required().messages(
        {"string.empty": "Password is required", "string.pattern.base": "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"}
    ),

    role: Joi.string().valid("student", "admin", "instructor").optional().messages(
        {"any.only": "Role must be either 'admin', 'instructor', or 'student'"}
    )
});

/* ♣ Email Verification Validation ♣ */
export const EmailVerificationValidation = Joi.object({
    email: Joi.string().email().required().messages(
        {"string.empty": "Email is required", "string.email": "Invalid email address", "any.required": "Email is required"}
    ),

    otp: Joi.string().pattern(/^\d{6}$/).required().messages(
        {"string.empty": "OTP is required", "string.pattern.base": "OTP must be 6 digits"}
    )
})
