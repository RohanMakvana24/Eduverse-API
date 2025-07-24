import UserModel from "../../models/UserModel.js";
import VerificationEmailQueue from "../../queue/emailQueue.js";
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
      otp: otpCode,
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
    user.refreshTokens.push(refreshToken);
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
    user.refreshTokens.push(refreshToken);

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
    return res.status(500).json({
      success: true,
      message: error.message,
    });
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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ♣ Logout Controller ♣ */
export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  // Check If Refresh Token is Valid
  try {
    const decode = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // Check If exist refreshToken exists
    const user = await UserModel.findOne({ refreshTokens: refreshToken });
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
    return res.status(200).json({
      success: true,
      message: "User Logout Succefully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* `♣` Forgot Password Controller `♣` */
export const ForgotPassword = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ♣ Forgot Password Controller ♣ */
export const ForgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    // Check User Exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Check is Email Verified
    const isVerified = user.isEmailVerified;
    if (!isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User not verified" });
    }

    // Crypto To Generates Verification Tokne
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Store Verification Token In User
    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 1000 * 60 * 60 * 24;

    // Sending Email
    await VerificationEmailQueue.add("verificationEmailQueue", {
      to: user.email,
      subject: "Forgot Password Verification",
      name: user.fullname,
      verificationToken: verificationToken,
      user: user,
    });

    // Success Response
    return res.status(200).json({
      success: true,
      message: "Verification email sent to your email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
