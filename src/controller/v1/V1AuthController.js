import UserModel from "../../models/UserModel.js";
import {
  resetPasswordEmailQueue,
  VerificationEmailQueue,
} from "../../queue/emailQueue.js";
import deleteImage from "../../utils/DeleteImage,.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/Tokens.js";
import { v4 as uuidv4 } from "uuid";
import geoip from "geoip-lite";
import blackListedAccessToken from "../../utils/accessTokenBlackList.js";
import redisClient from "../../redis/redis.js";
import { generateCryptoToken } from "../../utils/cryptoToken.js";
import crypto from "crypto";

/* ♣ Signup Controller ♣ */
export const Signup = async (req, res) => {
  try {
    const { fullname, email, password, file, role } = req.body;

    // Check User Exists
    const user = await UserModel.findOne({ email });

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
      await deleteImage(req.file.filename);
    }

    // Store User
    const newUser = await UserModel.create({
      fullname,
      email,
      password,
      avatar: {
        public_id: req.file.filename,
        url: req.file.path,
      },
      role,
    });

    const otpCode = newUser.generateOTPCode();
    await newUser.save();

    // Send OTP Code To User Email
    await VerificationEmailQueue.add("verificationEmailQueue", {
      to: newUser.email,
      subject: "Verification Code",
      name: newUser.fullname,
      otpOrLink: otpCode,
      user: newUser,
    });

    // success response
    return res
      .status(200)
      .json({ success: true, message: "Verification code sent to your email" });
  } catch (error) {
    await deleteImage(req.file.filename);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ♣ Email Verification Controller ♣ */
export const EmailVerification = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check User Exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified Try to login",
      });
    }

    // Check if OTP is correct
    if (user.otp.expiresAt < Date.now()) {
      user.otp = undefined;
      await user.save();
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    if (user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // OTP Valid
    user.isEmailVerified = true;
    user.otp = undefined;

    // Access Token
    const accessToken = generateAccessToken(user._id);

    // Refresh Token
    const refreshToken = generateRefreshToken(user._id);

    await user.save();

    // Store User Session Log
    const sessionId = uuidv4();
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    const geo = geoip.lookup(ipAddress);
    const location = geo ? `${geo.city}, ${geo.country}` : "Unknown";

    const sessionLog = {
      sessionId: sessionId,
      ipAddress: ipAddress,
      userAgent: userAgent,
      location: location,
      refreshTokens: [refreshToken],
      loginAt: Date.now(),
    };

    user.sessions.push(sessionLog);
    await user.save();

    // Success Response
    return res.status(200).json({
      success: true,
      message: "Registration successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ♣ Login Controller ♣ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check User Exists
    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User not verified" });
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }
    // Access Token
    const accessToken = generateAccessToken(user._id);

    // Refresh Token
    const refreshToken = generateRefreshToken(user._id);

    // Store User Session Log
    const sessionId = uuidv4();
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    const geo = geoip.lookup(ipAddress);
    const location = geo ? `${geo.city}, ${geo.country}` : "Unknown";

    const sessionLog = {
      sessionId: sessionId,
      ipAddress: ipAddress,
      userAgent: userAgent,
      location: location,
      refreshTokens: [refreshToken],
      loginAt: Date.now(),
    };
    user.sessions.push(sessionLog);
    await user.save();
    // Success Response
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ♣ Resend Email OTP Controller ♣ */
export const ResendEmailOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // User Exist
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified, try to login",
      });
    }

    // Checl If  OTP Already Generates And check not expired
    if (user.otp && user.otp.expiresAt > Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP already sent, please check your email",
      });
    }

    // Generate New OTP Code
    const otpCode = user.generateOTPCode();
    await user.save();

    // Send OTP Code To User Email
    await VerificationEmailQueue.add("verificationEmailQueue", {
      to: user.email,
      subject: "New Verification Code",
      name: user.fullname,
      otp: otpCode,
      user: user,
    });

    // Success Response
    return res.status(200).json({
      success: true,
      message: "New verification code sent to your email",
    });
  } catch (error) {
    return res.status(500).json({ success: true, message: error.message });
  }
};

// /* ♣ Refresh Token Controller ♣ */
export const RefreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  // Check If Refresh Token is Valid
  try {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Refresh token has expired. Please log in again."
          : "Invalid refresh token. Please log in again.",
    });
  }

  try {
    // Check If exist refreshToken exists
    const user = await UserModel.findOne({ refreshTokens: refreshToken });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Refresh token has expired. Please log in again.",
      });
    }

    const accessToken = generateAccessToken(user._id);

    // Success Response
    return res.status(200).json({
      success: true,
      message: "Access Token Generated Succefully",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ♣ Logout Controller ♣ */
export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  // Check If Refresh Token is Valid
  try {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Check If exist refreshToken exists
    const user = await UserModel.findOne({
      "sessions.refreshTokens": refreshToken,
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Refresh token has expired. Please log in again.",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Refresh token has expired. Please log in again."
          : "Invalid refresh token. Please log in again.",
    });
  }

  try {
    const user1 = req.user;
    const sessionId = user1.sessions[0].sessionId;
    const accessToken = req.accessToken;
    await redisClient.set(`BlackListedAccessToken:${accessToken}`, "true", {
      EX: 3600, // Blacklist for 1 hour
    });
    // Updated User
    await UserModel.updateOne(
      {
        _id: user1._id,
        "sessions.sessionId": sessionId,
      },
      {
        $set: {
          "sessions.$.logoutAt": Date.now(),
          "sessions.$.active": false,
        },
        $pull: {
          refreshTokens: refreshToken,
        },
      }
    );

    // Success Response
    return res
      .status(200)
      .json({ success: true, message: "User Logout Succefully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
/* `♣` Forgot Password Controller `♣` */
export const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check User Exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found with this email" });
    }

    // Check User Verified
    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "User not verified, please verify your email first",
      });
    }

    // Generate Crypto Token
    const { rawToken, hashedToken, expiresAt } = generateCryptoToken();

    // Sending Email
    await resetPasswordEmailQueue.add("ResetPassswordEmail", {
      to: user.email,
      subject: "Reset Password Varification",
      name: user.fullname,
      otpOrLink: `${process.env.APP_BASE_URL}/resetPassword/${rawToken}`,
    });
    // Store
    user.resetPasswordToken = hashedToken;
    user.resetPasswordTokenExpiresAt = expiresAt;
    await user.save();

    // success response
    return res.status(200).json({
      success: true,
      message: "Email sent! Follow the instructions to reset your password.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* `♣` Reset Password Controller `♣` */
export const ResetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { email, password } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "Token is required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found with this email" });
    }
    if (!user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: "User not verified, please verify your email first",
      });
    }

    // Check if reset password token is valid
    const hashedToken = crypto
      .createHash("sha256")
      .update(`resetPassword:${token}`)
      .digest("hex");

    // Check if token is expired
    if (
      !user.resetPasswordToken ||
      user.resetPasswordToken !== hashedToken ||
      user.resetPasswordTokenExpiresAt < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "Reset password token is invalid or has expired",
      });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;

    // Save User
    await user.save();

    // Success Response
    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* `♣` Reset Password Controller `♣` */
export const getUser = async (req, res) => {
  try {
    const user = req.user;

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Success Response
    return res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
