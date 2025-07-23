import redisClient from "../redis/redis.js";

const blackListedAccessToken = async (token) => {
  try {
    await redisClient.set(`BlackListedAccessToken:${token}`, true, {
      EX: 3600,
    });
  } catch (error) {
    console.log(error);
  }
};
export default blackListedAccessToken;
