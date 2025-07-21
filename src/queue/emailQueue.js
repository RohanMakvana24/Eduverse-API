import {Queue} from "bullmq"
import connection from "../redis/IOredis.js"

const VerificationEmailQueue = new Queue("verificationEmailQueue", {connection})

export default VerificationEmailQueue;
