import 'dotenv/config';
import {v2 as cloudinary} from "cloudinary"
import {CloudinaryStorage} from "multer-storage-cloudinary"

cloudinary.config({cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET})

const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Eduverse-API/avatars",
        allowedFormats: ["jpg", "png", "jpeg"]
    }
});

export {
    cloudinary,
    cloudinaryStorage
}
