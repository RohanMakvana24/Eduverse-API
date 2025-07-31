export const createCourse = async (req, res) => {
  try {
    const courseData = req.body;

    const fileMap = {};
    if (Array.isArray(req.files)) {
      req.files.forEach((file) => {
        fileMap[file.fieldname] = file.path;
      });
    }

    // Your course creation logic here
  } catch (error) {
    // 🔍 Log the full error properly
    console.error("❌ Course creation failed:");
    console.error("Error object:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Optional: for catching unexpected thrown objects
    if (typeof error === "object") {
      console.error("Error JSON:", JSON.stringify(error, null, 2));
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message || "Unknown error",
    });
  }
};
