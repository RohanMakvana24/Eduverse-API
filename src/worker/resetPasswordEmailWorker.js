import { Worker } from "bullmq";
import { sendEmail } from "../utils/sendEmail.js";
import connection from "../redis/IOredis.js";

// `` Reset Password Email Worker `` //
const resetPasswordEmailWorker = new Worker(
  "resetPasswordEmailQueue",
  async (job) => {
    try {
      const { to, subject, name, otpOrLink } = job.data;
      await sendEmail(to, subject, name, otpOrLink);
      console.log("Reset Password Email Send Succefully");
    } catch (error) {
      console.log(error);
    }
  },
  { connection }
);

export default resetPasswordEmailWorker;
