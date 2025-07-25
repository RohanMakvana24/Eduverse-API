import { Queue } from "bullmq";
import connection from "../redis/IOredis.js";

// `` Email Verification Email Queue `` //s
export const VerificationEmailQueue = new Queue("verificationEmailQueue", {
  connection,
});

// `` Reset PAssword Verification Token Email Queue `` //
export const resetPasswordEmailQueue = new Queue("resetPasswordEmailQueue", {
  connection,
});
