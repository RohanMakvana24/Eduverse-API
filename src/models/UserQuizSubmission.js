import mongoose from "mongoose";

const userQuizSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    topicId: mongoose.Schema.Types.ObjectId,
    score: Number,
    totalQuestions: Number,
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("UserQuizSubmission", userQuizSubmissionSchema);
