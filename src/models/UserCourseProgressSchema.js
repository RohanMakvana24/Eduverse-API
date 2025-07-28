import mongoose from "mongoose";

const UserCourseProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
    watchedTopics: [
      {
        sectionId: mongoose.Schema.Types.ObjectId,
        chapterId: mongoose.Schema.Types.ObjectId,
        topicId: mongoose.Schema.Types.ObjectId,
        watchedPercantage: Number,
        completedAt: Date,
      },
    ],
    unlockedTopics: [
      {
        sectionId: mongoose.Schema.Types.ObjectId,
        chapterId: mongoose.Schema.Types.ObjectId,
        topicId: mongoose.Schema.Types.ObjectId,
        unlockedAt: { type: Date, default: Date.now() },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserCourseProgressModel = mongoose.model(
  "UserCourseProgress",
  UserCourseProgressSchema
);

export default UserCourseProgressModel;
