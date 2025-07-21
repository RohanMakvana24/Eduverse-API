import multer from "multer";
import {cloudinaryStorage} from "../../config/cloudinary/cloudinary.js";

const upload = multer({storage: cloudinaryStorage})

export default upload;
