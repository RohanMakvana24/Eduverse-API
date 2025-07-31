export const ValdiateReq = (schema, options = {}) => {
  return (req, res, next) => {
    try {
      const parsedBody = req.body?.data ? JSON.parse(req.body.data) : req.body;
      const { error, value } = schema.validate(parsedBody, {
        abortEarly: false,
        stripUnknown: true,
      });
      req.body = value;

      const errors = [];

      if (error) {
        errors.push(
          ...error.details.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          }))
        );
      }

      if (options.requiredCourseFiles) {
        if (!Array.isArray(req.files)) {
          errors.push({
            field: "files",
            message: "No files were uploaded",
          });
        } else {
          const thumbnailFile = req.files.find(
            (f) => f.fieldname === "thumbnail"
          );
          if (!thumbnailFile) {
            errors.push({
              field: "thumbnail",
              message: "Thumbnail is required",
            });
          }

          const videoFiles = req.files.filter(
            (f) => f.fieldname.split(".").pop() === "video"
          );
          if (videoFiles.length === 0) {
            errors.push({
              field: "video",
              message: "At least one video is required",
            });
          }
        }
      }

      if (errors.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors,
        });
      }

      next();
    } catch (err) {
      console.error("❌ Validation Middleware Error:", err);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message || String(err),
      });
    }
  };
};
