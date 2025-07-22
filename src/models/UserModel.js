import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  ipAddress: String,
  userAgent: String,
  location: String,
  loginAt: {
    type: Date,
    default: Date.now,
  },
  logoutAt: {
    type: Date,
    default: null,
  },
  active: {
    type: Boolean,
    default: true,
  },
  revoked: {
    type: Boolean,
    default: false,
  },
});

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    avatar: {
      public_id: String,
      url: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      code: String,
      expiresAt: Date,
    },
    refreshTokens: [String],
    sessions: [sessionSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// ~ Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ~ Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ~ Generate OTP Code
userSchema.methods.generateOTPCode = function () {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  this.otp = {
    code: otp,
    expiresAt: Date.now() + 2 * 60 * 1000,
  };

  return otp;
};

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
