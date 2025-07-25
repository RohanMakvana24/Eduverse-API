import UserModel from "../../models/UserModel.js";
import { VerificationEmailQueue } from "../../queue/emailQueue.js";
import deleteImage from "../../utils/DeleteImage,.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/Tokens.js";
import { v4 as uuidv4 } from "uuid";
import geoip from "geoip-lite";

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
