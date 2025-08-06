import mongoose from "mongoose";
import CourseModel from "../../models/CourseModel.js";
import deleteImage from "../../utils/DeleteImage,.js";

// 📚 Create Course Controller
export const createCourse = async (req, res) => {
  try {
    const { title, slug, description, price, instructor, isFree } = req.body;

    // ~~ Validation ~~
    const isExist = await CourseModel.findOne({ slug: slug });
    if (isExist) {
      return res.status(404).json({
        success: false,
        message: "Course Slug is already exist",
      });
    }

    // ~~ Create Class
    const newCourse = await CourseModel.create({
      title: title,
      slug: slug,
      description: description,
      price: price || 0,
      isFree: isFree,
      instructor,
      thumbnail: {
        public_id: req.file.filename,
        url: req.file.path,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Course Created Succefully",
      newCourse: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📚 Get Course Controller
export const getAllCourse = async (req, res) => {
  try {
    const courses = await CourseModel.find({});
    if (!courses) {
      return res.status(400).json({
        success: false,
        message: "Courses Not Exist",
      });
    }

    return res.status(200).json({
      success: true,
      courses: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📚 Get Single Course Controller
export const getSingleCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validation =
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a course ID",
      });
    }

    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "No course found with the given ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Course retrieved successfully",
      course: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📚 Update Course Controller
export const updateCourse = async (req, res) => {
  try {
    const { title, description, price, isFree } = req.body;
    const { courseId } = req.params;

    // Validation
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(404).json({
        success: false,
        message: "Please provide a course ID",
      });
    }

    // Find Course
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "No course found with the given ID",
      });
    }

    if (req.file) {
      deleteImage(course.thumbnail.public_id);
      course.thumbnail = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    // Update Course
    course.title = title;
    course.description = description;
    course.price = price;
    course.isFree = isFree;
    await course.save();

    return res.status(200).json({
      success: true,
      message: "Course Updated Succefully",
      course: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 📚 Delete Course Controller
export const deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validation
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a course ID",
      });
    }

    // Find Course
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "No course found with the given ID",
      });
    }

    // Delete Course
    await CourseModel.findByIdAndDelete(courseId);

    // Success Response
    return res.status(200).json({
      success: true,
      message: "Course Deleted Succefully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
