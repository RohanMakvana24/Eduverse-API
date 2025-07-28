import UserModel from "../../models/UserModel.js";

/* ♣ Get User Profile Controller  ♣ */
export const GetUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const newUser = {
      fullname: user.fullname,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    };
    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile",
      error: error.message,
    });
  }
};

/* ♣ Update Profile Controller  ♣ */
export const UpdateUserProfile = async (req, res) => {
  try {
    const user = req.user;
    const { fullname, email } = req.body;

    // Update user profile
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;

    if (req.file) {
      // If a new file is uploaded, update the avatar
      user.avatar = {
        public_id: req.file.filename,
        url: req.file.path,
      };
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: {
        fullname: user.fullname,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: error.message,
    });
  }
};

/* ♣ Change Password Controller  ♣ */
export const ChangePassword = async (req, res) => {
  try {
    const uid = req.user._id;
    const { currentPassword, newPassword } = req.body;

    const user = await UserModel.findById(uid).select("+password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Update PAssword
    user.password = newPassword;
    await user.save();

    // success response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

/* ♣ Get Active Session Of User Controller  ♣ */
export const getActiveSessions = async (req, res) => {
  try {
    const user = req.user;
    const activeSessions = user.sessions.filter((session) => session.active);
    if (!activeSessions.length) {
      return res.status(404).json({
        success: false,
        message: "No active sessions found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Active sessions retrieved successfully",
      data: activeSessions,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve active sessions",
      error: error.message,
    });
  }
};

/* ♣ Logout From Specific Device Controller  ♣ */
export const logoutFromSession = async (req, res) => {
  try {
    const userId = req.user._id; // from auth middleware
    const { sessionId } = req.params;
    const { refreshToken } = req.body;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const session = user.sessions.find((s) => s.sessionId === sessionId);
    if (!session || !session.active) {
      return res
        .status(404)
        .json({ success: false, message: "Active session not found" });
    }

    // Invalidate session
    session.active = false;
    session.revoked = true;
    session.logoutAt = new Date();

    // Remove specific refresh token if provided
    if (refreshToken) {
      session.refreshTokens = session.refreshTokens.filter(
        (token) => token !== refreshToken
      );
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Logged out from selected session and refresh token revoked",
    });
  } catch (err) {
    console.error("Logout session error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
