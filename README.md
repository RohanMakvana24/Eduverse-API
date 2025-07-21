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

| Version | Status       | Path Prefix | Deprecation Date | Notes                      |
|---------|--------------|-------------|------------------|----------------------------|
| v1      | ✅ Active | `/api/v1`   | -     | Legacy structure & fields |
| v2      | ✅ Active     | `/api/v2`   | -                | Current and recommended   |

> ⚠️ v1 responses include deprecation warnings via `X-API-Warning` headers.

---

## 📚 Routes Summary

### 🔐 Auth API Routes

| Feature              | v1 Endpoint                      | v2 Endpoint                      | Description                                  |
|----------------------|----------------------------------|----------------------------------|----------------------------------------------|
| 📝 Signup            | `/api/v1/auth/signup`            | `/api/v2/auth/signup`            | Register a new user                          |
| ✅ Email Verification| `/api/v1/auth/verify-email`      | `/api/v2/auth/verify-email`      | Verify user email using OTP or token         |

> 💡 v2 may include improvements like rate limiting, OTP expiry, or stronger validation.

---

## 🛠️ Installation

```bash
git clone https://github.com/your-org/eduverse-api.git
cd eduverse-api
npm install
cp .env.example .env
