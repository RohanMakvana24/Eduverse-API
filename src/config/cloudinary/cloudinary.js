import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folderPath = "Eduverse-API/Others";
    let resourceType = "image";
    // Check if Users folder is needed
    if (
      file.fieldname === "file" ||
      req.baseUrl.includes("/auth") ||
      req.baseUrl.includes("/user")
    ) {
      folderPath = "Eduverse-API/Users";
      let resourceType = "image";
    }
    // If Course folder is needed
    else if (req.baseUrl.includes("/course")) {
      const courseData = JSON.parse(req.body.data);
      const courseSlug = courseData.slug;

      // If Slug is not provided
      if (!courseSlug) {
        throw new Error("Course slug  is required for course uploads.");
      }

      // Folder Selection
      let subfolder = "others";
      if (file.fieldname === "thumbnail") {
        subfolder = "thumbnails";
        resourceType = "image";
      } else {
        subfolder = "videos";
        resourceType = "video";
      }
      folderPath = `Eduverse-API/courses/${courseSlug}/${subfolder}`;
    }

    return {
      folder: folderPath,
      resource_type: resourceType,
      allowed_formats: ["jpg", "png", "jpeg", "mp4", "pdf", "docx"],
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
    };
  },
});

export { cloudinary, cloudinaryStorage };
