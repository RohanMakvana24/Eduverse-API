import mongoose from "mongoose";

// 🚀 Material Schema
const materialSchema = new mongoose.Schema({
  title: String,
  file: {
    public_id: String,
    url: String,
  },
});
// 🚀 Topics Schema
const topicsSchema = new mongoose.Schema({
  title: {
    type: String,
    video: {
      url: String,
      public_id: String,
    },
    duration: {
      type: Number,
    },
    locked: {
      type: Boolean,
      default: true,
    },
  },
});
// 🚀 Chapters Schema
const chapterSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  topics: [topicsSchema],
});
// 🚀 Module Schema
const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  chapters: [chapterSchema],
  materials: [materialSchema],
});
const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      public_id: String,
      url: String,
    },
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    sections: [sectionSchema],
  },
  {
    timestamps: true,
  }
);

const CourseModel = mongoose.model("Courses", CourseSchema);
export default CourseModel;
