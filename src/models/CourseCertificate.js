import mongoose, { mongo } from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    certificateId: String,
  },
  {
    timestamps: true,
  }
);

const CertificateModel = new mongoose.model("Certificates", certificateSchema);
export default CertificateModel;
