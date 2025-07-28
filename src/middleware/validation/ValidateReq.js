export const ValdiateReq = (schema, options = {}) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    req.body = value;
    const errors = [];
    // if there are errors, push them to the errors array
    if (error) {
      errors.push(
        ...error.details.map((err) => ({
          field: err.path[0],
          message: err.message,
        }))
      );
    }

    // validate file
    if (options.requireFile) {
      if (!req.file) {
        errors.push({ field: "file", message: "Avatar is required" });
      } else if (
        !["image/png", "image/jpg", "image/jpeg"].includes(req.file.mimetype)
      ) {
        errors.push({ field: "file", message: "Avatar must be an image" });
      }
    }

    if (options.optionalFile && req.file) {
      if (
        !["image/png", "image/jpg", "image/jpeg"].includes(req.file.mimetype)
      ) {
        errors.push({ field: "file", message: "Avatar must be an image" });
      }
    }

    // send response if there are errors
    if (errors.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Validation error", errors });
    }

    next();
  };
};
