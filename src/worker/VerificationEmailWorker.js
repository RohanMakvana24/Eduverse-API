import { Worker } from "bullmq";
import connection from "../redis/IOredis.js";
import { sendEmail } from "../utils/sendEmail.js";
import deleteImage from "../utils/DeleteImage,.js";

const VerificationEmailWorker = new Worker(
  "verificationEmailQueue",
  async (job) => {
    try {
      const { to, subject, name, otpOrLink } = job.data;
      console.log("Job data:", job.data);
      await sendEmail(to, subject, name, otpOrLink);
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      if (user) {
        await deleteImage(user.avatar.public_id);
        await UserModel.findByIdAndDelete(user._id);
        console.log("User deleted successfully");
      } else {
        console.log("User not deleted");
      }
    }
  },
  { connection }
);

export default VerificationEmailWorker;
