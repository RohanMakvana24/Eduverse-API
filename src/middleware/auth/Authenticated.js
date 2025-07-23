import jwt from "jsonwebtoken";
import UserModel from "../../models/UserModel.js";
import redisClient from "../../redis/redis.js";
// 🔏 Check is authenticated basaed on accessToken 🔏
export const isAuthenticated = async (req, res, next) => {
  try {
    const accessToken = req.headers?.authorization?.split(" ")[1];
    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Authentication failed: access token not provided.",
      });
    }
    const isBlackListedAccessToken = await redisClient.get(
      `BlackListedAccessToken:${accessToken}`
    );
    console.log("isBlackListedAccessToken", isBlackListedAccessToken);
    if (isBlackListedAccessToken) {
      return res.status(400).json({
        success: false,
        message: "Unauthorized access. This token has been blacklisted.",
      });
    }
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "Access denied. You are not authorized to perform this action.",
      });
    }
    req.user = user;
    req.accessToken = accessToken;
    next();
  } catch (error) {
    console.log("client" + error);
    return res.status(500).json({
      success: false,
      message: "Access denied. You are not authorized to perform this action.",
    });
  }
};
