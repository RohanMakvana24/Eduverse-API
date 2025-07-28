# 🎓 Eduverse API

Welcome to the official **Eduverse API** — a robust, versioned RESTful API built for modern online learning platforms. Whether you're developing a learning app like Udemy or Skillshare, Eduverse is your scalable, future-ready backend solution.

Built with **Node.js**, **Express**, **MongoDB**, and background workers (BullMQ + Redis), this API supports clean architecture, multi-versioning, and user-friendly endpoints.

---

## 🚀 Base URL

```bash
http://localhost:2421/

```

---

## 🧭 Versioning Strategy

Eduverse uses **URI versioning** to support backward compatibility and iterative improvements.

| Version | Status    | Path Prefix | Deprecation Date | Notes                     |
| ------- | --------- | ----------- | ---------------- | ------------------------- |
| v1      | ✅ Active | `/api/v1`   | -                | Legacy structure & fields |
| v2      | ✅ Active | `/api/v2`   | -                | Current and recommended   |

> ⚠️ v1 responses include deprecation warnings via `X-API-Warning` headers.

---

## 📚 Routes Summary

### 🔐 Auth API Routes

| #   | Feature               | v1 Endpoint                         | v2 Endpoint                         | Description                                      |
| --- | --------------------- | ----------------------------------- | ----------------------------------- | ------------------------------------------------ |
| 1   | 📝 Signup             | `/api/v1/auth/signup`               | `/api/v2/auth/signup`               | Register a new user                              |
| 2   | 🔁 Resend Email OTP   | `/api/v1/auth/resend-email-otp`     | `/api/v2/auth/resend-email-otp`     | Resend OTP to user email for verification        |
| 3   | 🔑 Login              | `/api/v1/auth/login`                | `/api/v2/auth/login`                | Log in a user and receive JWT/session token      |
| 4   | ✅ Email Verification | `/api/v1/auth/verify-email`         | `/api/v2/auth/verify-email`         | Verify user email using OTP                      |
| 5   | 🚦 Refresh Token      | `/api/v1/auth/refresh-token`        | `/api/v2/auth/refresh-token`        | Generate new access token using refresh token    |
| 6   | 🚪 Logout             | `/api/v1/auth/logout`               | `/api/v2/auth/logout`               | Invalidate refresh token and logout user         |
| 7   | ❓ Forgot Password    | `/api/v1/auth/forgot-password`      | `/api/v2/auth/forgot-password`      | Send reset password link/OTP to registered email |
| 8   | 🔁 Reset Password     | `/api/v1/auth/resetPassword/:token` | `/api/v2/auth/resetPassword/:token` | Reset password using token from email            |
| 9   | 👤 Get Current User   | `/api/v1/auth/me`                   | `/api/v2/auth/me`                   | Get authenticated user's profile/details         |

> 💡 v2 may include improvements like rate limiting, OTP expiry, or stronger validation.

---

## 👤 User API Routes

| #   | Feature                 | v1 Endpoint                        | v2 Endpoint                        | Description                                            |
| --- | ----------------------- | ---------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| 1   | 👤 Get Profile          | `/api/v1/user/profile`             | `/api/v2/user/profile`             | Get authenticated user's profile info                  |
| 2   | 🛠️ Update Profile Info  | `/api/v1/user/profile`             | `/api/v2/user/profile`             | Update user's profile with optional avatar upload      |
| 3   | 🔒 Change Password      | `/api/v1/user/change-password`     | `/api/v2/user/change-password`     | Change current user's password                         |
| 4   | 💻 View Active Sessions | `/api/v1/user/sessions`            | `/api/v2/user/sessions`            | Get list of all active login sessions for the user     |
| 5   | 🚪 Logout from Session  | `/api/v1/user/sessions/:sessionId` | `/api/v2/user/sessions/:sessionId` | Logout from a specific device session and revoke token |

---

## 🛠️ Installation

```bash
git clone https://github.com/your-org/eduverse-api.git
cd eduverse-api
npm install
cp .env.example .env
```
