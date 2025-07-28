import mongoose from "mongoose";

const UserCourseEnrollmentSchema = new mongoose.Schema(
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
    isPaid: {
      type: Boolean,
      default: false,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    paymentDetails: {
      orderId: String,
      paymentId: String,
      status: {
        type: String,
        enum: ["pending", "completed", "failed"],
        default: "pending",
      },
      amount: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  }
);

const UserCourseEnrollmentModel = mongoose.model(
  "UserCourseEnrollment",
  UserCourseEnrollmentSchema
);
