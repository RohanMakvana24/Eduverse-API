import {v2 as cloudinary} from "cloudinary"

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        console.log("✅ Image deleted from Cloudinary:", result);
    } catch (err) {
        console.error("Failed to delete image from Cloudinary:", err);
    }
}

export default deleteImage
