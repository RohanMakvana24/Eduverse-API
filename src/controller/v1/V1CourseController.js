import mongoose, { mongo } from "mongoose";
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

    // Delete Course Thumbnail
    deleteImage(course.thumbnail.public_id);

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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 🚀 Section Controller 🚀 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //

/* Create Course Section Controller */
export const CreateSectionController = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { courseId } = req.params;

    // Course id Validation
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Course id is required",
      });
    }

    // Check Already Title exist with section
    const titleCourse = await CourseModel.findOne({
      _id: courseId,
      "sections.title": title,
    });
    if (titleCourse) {
      return res.status(400).json({
        success: false,
        message: "Section Title Already Exist",
      });
    }
    // Check if Course Exist
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "No course found with the given ID",
      });
    }

    // Add Course Inside a section
    course.sections.push({
      title: title,
      description: description,
    });

    await course.save();
    // Success Response
    return res.status(200).json({
      success: true,
      message: "Section Added Succesfully",
      course: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Get Course Section Controller */
export const GetAllCourseSection = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Validation
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a course ID",
      });
    }

    // Check Course Exist
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "No course found with the given ID",
      });
    }

    // Success Response
    return res.status(200).json({
      success: true,
      message: "Succesfully Get all sections in a course ",
      course: course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Get a specific section Controller */
export const GetSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;

    // Course Validation
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a course ID",
      });
    }

    // SectionId Validation
    if (!sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a section ID",
      });
    }

    // Check If Course Exist
    const course = await CourseModel.findOne(
      {
        _id: courseId,
        "sections._id": sectionId,
      },
      {
        "sections.$": 1,
      }
    );
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "No course found with the given ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Section retrieved successfully",
      section: course.sections[0],
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message: error.message,
    });
  }
};

/* Update section title/description */
export const UpdateSection = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { courseId, sectionId } = req.params;

    // Course Id Validation
    if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a course ID",
      });
    }

    // Section Id Validation
    if (!sectionId || !mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a section ID",
      });
    }

    // Find Course With Course ID and Section ID
    const updatedcourse = await CourseModel.findOneAndUpdate(
      {
        _id: courseId,
        "sections._id": sectionId,
      },
      {
        $set: {
          "sections.$.title": title,
          "sections.$.description": description,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedcourse) {
      return res.status(404).json({
        success: false,
        message: "No course found with the given ID",
      });
    }

    // Success Response
    return res.status(200).json({
      success: true,
      message: "Course Section Updated Succefully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* Delete Specific Section Controller */
export const deleteSection = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid section ID" });
    }

    // Check if section exists
    const course = await CourseModel.findOne({
      _id: courseId,
      "sections._id": sectionId,
    });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Section not found in this course",
      });
    }

    // Delete the section
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      { $pull: { sections: { _id: sectionId } } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      course: updatedCourse,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* Create Section Inside A Chapter Controller */
export const createChapter = async (req, res) => {
  try {
    const { courseId, sectionId } = req.params;
    const { title, description } = req.body;
    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid course ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid section ID" });
    }

    const course = await CourseModel.findOne({
      _id: courseId,
      "sections._id": sectionId,
    });

    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Section not found in this course",
      });
    }

    // Find Section Index
    const sectionIndex = course.sections.findIndex(
      (sec) => sec._id.toString() === sectionId
    );

    if (sectionId === -1) {
      return res.status(400).json({
        success: false,
        message: "Section not found",
      });
    }

    const isDublicate = course.sections[sectionIndex].chapters.some(
      (chap) =>
        chap.title.trim().toLocaleLowerCase() ===
        title.trim().toLocaleLowerCase()
    );

    if (isDublicate) {
      return res.status(400).json({
        success: false,
        message: "A chapter with this title already exists in this section",
      });
    }
    // Create New Chapter
    const newChapter = {
      title,
      description,
      topics: [],
    };

    course.sections[sectionIndex].chapters.push(newChapter);

    // Save Course
    await course.save();

    return res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      chapter: newChapter,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
