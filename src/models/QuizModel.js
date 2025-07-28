import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswer: String,
});

const quizSchema = new mongoose.Schema(
  {
    topicId: mongoose.Schema.Types.ObjectId,
    questions: [questionSchema],
    passingScore: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
